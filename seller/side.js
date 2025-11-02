const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggleSidebarBtn');
    const toggleIcon = document.getElementById('toggleIcon');
    const mainContent = document.getElementById('mainContent');

        toggleButton.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
            sidebar.classList.toggle('show');
        } else {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }


        const isSidebarOpen = !sidebar.classList.contains('collapsed') && !sidebar.classList.contains('show') ? false : true;
        if (sidebar.classList.contains('show') || !sidebar.classList.contains('collapsed')) {
            toggleIcon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            toggleIcon.classList.replace('fa-xmark', 'fa-bars');
        }
        });


        window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('show');
            toggleIcon.classList.replace('fa-xmark', 'fa-bars');
        }
        });