// custom JavaScript goes here

// ============================================
// Sidebar Toggle Feature (Desktop Only)
// ============================================
(function() {
  var STORAGE_KEY = 'jtd-sidebar-collapsed';

  // Wait for DOM ready
  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  onReady(function() {
    var toggleButton = document.getElementById('sidebar-toggle');
    if (!toggleButton) return;

    // Restore state from localStorage
    var isCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
      toggleButton.setAttribute('aria-expanded', 'false');
    }

    // Toggle on click
    toggleButton.addEventListener('click', function() {
      var collapsed = document.body.classList.toggle('sidebar-collapsed');
      toggleButton.setAttribute('aria-expanded', !collapsed);
      localStorage.setItem(STORAGE_KEY, collapsed);
    });

    // Keyboard shortcut: Ctrl+\ (backslash)
    document.addEventListener('keydown', function(e) {
      if (e.ctrlKey && e.key === '\\') {
        e.preventDefault();
        toggleButton.click();
      }
    });
  });
})();
