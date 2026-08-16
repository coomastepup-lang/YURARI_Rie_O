(() => {
  const nav = document.querySelector('.nav');
  const menuButton = document.querySelector('.menu-button');
  const overlay = document.querySelector('.save-overlay');
  const notice = document.querySelector('.save-notice');
  let noticeTimer;

  const showNotice = (message) => {
    clearTimeout(noticeTimer);
    notice.textContent = message;
    notice.hidden = false;
    noticeTimer = setTimeout(() => { notice.hidden = true; }, 5000);
  };

  const closeSave = () => {
    overlay.hidden = true;
    notice.hidden = true;
  };

  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  document.querySelector('.save-button').addEventListener('click', () => {
    notice.hidden = true;
    overlay.hidden = false;
    document.querySelector('.save-close').focus();
  });
  document.querySelector('.save-close').addEventListener('click', closeSave);
  overlay.addEventListener('mousedown', (event) => { if (event.target === overlay) closeSave(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeSave(); });

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      showNotice('リンクをコピーしました。');
    } catch {
      showNotice('リンクをコピーできませんでした。ブラウザのアドレス欄からコピーしてください。');
    }
  };

  document.querySelector('[data-action="favorite"]').addEventListener('click', () => {
    showNotice(/Mac|iPhone|iPad/.test(navigator.userAgent)
      ? 'Macは ⌘＋D、iPhone・iPadは共有メニューから「ブックマークを追加」を選んでください。'
      : 'パソコンは Ctrl＋D、スマートフォンはブラウザのメニューから「ブックマーク」を選んでください。');
  });
  document.querySelector('[data-action="home"]').addEventListener('click', () => {
    showNotice('スマートフォンのブラウザメニューまたは共有メニューから「ホーム画面に追加」を選んでください。');
  });
  document.querySelector('[data-action="pdf"]').addEventListener('click', () => window.print());
  document.querySelector('[data-action="copy"]').addEventListener('click', copyLink);
  document.querySelector('[data-action="share"]').addEventListener('click', async () => {
    if (navigator.share) {
      try { await navigator.share({ title: document.title, text: 'リラクゼーション ゆらり｜小田原理恵', url: location.href }); } catch {}
    } else {
      await copyLink();
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
})();
