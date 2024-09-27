// Theme toggle functionality
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('#theme-toggle i');
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    }
});

// nav-item active
document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll('.nav-item');
    const currentPage = window.location.pathname.split('/').pop();

    navItems.forEach(item => {
        const href = item.getAttribute('href');

        item.classList.remove('active');
        
        if (href === currentPage) {
            item.classList.add('active');
        }
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme'); // Obtener el tema guardado
    const icon = document.querySelector('#theme-toggle i');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        document.body.classList.remove('dark-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});