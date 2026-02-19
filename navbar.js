document.addEventListener('DOMContentLoaded', () => {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');

    fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
        navbarPlaceholder.innerHTML = html;

        setupToggler();
    })
    .catch(error => {
        console.error('Error loading the navigation bar:', error);
    });
});

function setupToggler() {
    const toggler = document.getElementById('navbarToggler');
    const menu = document.getElementById('navbarMenu');

    if (toggler && menu){
        toggler.addEventListener('click', () => {
            menu.classList.toggle('activate');
            toggler.classList.toggle('active');
        });
    }
}