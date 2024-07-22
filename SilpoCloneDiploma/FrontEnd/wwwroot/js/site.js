document.addEventListener('DOMContentLoaded', function () {
    var dropdownToggle = document.getElementById('navbarDropdownMenuLink');
    var dropdownMenu = document.querySelector('.dropdown-menu-fullscreen');

    dropdownToggle.addEventListener('click', function (event) {
        event.preventDefault();
        dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', function (event) {
        if (!dropdownMenu.contains(event.target) && !dropdownToggle.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
});