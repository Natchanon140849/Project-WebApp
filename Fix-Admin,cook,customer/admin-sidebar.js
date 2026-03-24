(() => {
  const STORAGE_KEY = 'adminSidebarOpen';

  function setupAdminSidebar() {
    const drawer = document.getElementById('admin-drawer');
    if (!(drawer instanceof HTMLInputElement)) return;

    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    let stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }

    if (stored === '1' || stored === '0') {
      drawer.checked = stored === '1';
    } else {
      drawer.checked = mediaQuery.matches;
    }

    const persist = () => {
      try {
        localStorage.setItem(STORAGE_KEY, drawer.checked ? '1' : '0');
      } catch {
        // ignore
      }
    };

    drawer.addEventListener('change', persist);

    const handleBreakpointChange = () => {
      let now = null;
      try {
        now = localStorage.getItem(STORAGE_KEY);
      } catch {
        now = null;
      }

      if (now !== '1' && now !== '0') {
        drawer.checked = mediaQuery.matches;
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleBreakpointChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleBreakpointChange);
    }
  }

  function setupAdminLogout() {
    const logout = document.getElementById('logout');
    if (!(logout instanceof HTMLAnchorElement)) return;

    logout.addEventListener('click', () => {
      try {
        localStorage.removeItem('adminSession');
      } catch {
        // ignore
      }
    });
  }

  window.setupAdminSidebar = setupAdminSidebar;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupAdminSidebar();
      setupAdminLogout();
    }, { once: true });
  } else {
    setupAdminSidebar();
    setupAdminLogout();
  }
})();
