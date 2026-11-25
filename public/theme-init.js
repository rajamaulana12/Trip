(function () {
  try {
    var raw = localStorage.getItem('he_theme');
    var theme = raw ? JSON.parse(raw) : null;
    if (theme !== 'dark' && theme !== 'light') {
      theme =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    }
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
