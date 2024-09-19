document.addEventListener('DOMContentLoaded', function () {
    var dropdownToggle = document.getElementById('navbarDropdownMenuLink');
    const overlay = document.getElementById('overlay');
    var dropdownMenu = document.querySelector('.dropdown-menu-fullscreen');
    var dropdownItems = document.getElementsByClassName('dropdown-item');
    var panel = document.getElementById('categoryPanel');
    var basket = document.getElementById('basketDiv');

    dropdownToggle.addEventListener('click', function (event) {
        event.preventDefault();
        dropdownMenu.classList.toggle('show');
        panel.classList.toggle('show');
        if (panel.classList.contains('show')) {
            generateCategoryInitialisator();
            overlay.style.display = 'block';
        }
        else {
            panel.innerHTML = '';
            overlay.style.display = 'none';
        }
    });

    dropdownToggle.addEventListener('mouseover', () => {
        categoriesLogo.src = '/icons/ListHover.png';
    });

    dropdownToggle.addEventListener('mouseout', () => {
        categoriesLogo.src = '/icons/List.png'; 
    });

    const categories = {
        'Фрукти': [
            { name: 'Сезонні фрукти', link: '/icons/Seasonal.png' },
            { name: 'Ягоди', link: '/icons/Berries.png' },
            { name: 'Фрукти', link: '/icons/Fruits.png' },
            { name: 'Смузі та фреші', link: '/icons/Smoothies.png' },
            { name: 'Фруктові снеки', link: '/icons/Fruit Snacks.png' },
            { name: 'Горіхи та сухофрукти', link: '/icons/Nuts.png' },
            { name: 'Дивитись інше', link: '/icons/Other.png' },
        ],
        // Add other categories here...
    };
    var lastMouseOverTime = 0;
    var delay = 1500;

    function generateCategoryInitialisator() {
        for (var i = 0; i < dropdownItems.length; i++) {
            dropdownItems[i].addEventListener('mouseover', function (event) {
                var currentTime = new Date().getTime();
                if (currentTime - lastMouseOverTime > delay) {
                    lastMouseOverTime = currentTime;
                    event.preventDefault();
                    //Next version
                    //generateCategoryPanel(dropdownItems[i].id);
                    generateCategoryPanel('Фрукти');
                }
            });
        }
    }

    function generateCategoryPanel(category) {
        panel.innerHTML = '';

        if (categories[category]) {
            var div = document.createElement('div');
            div.className = 'rowCategoryFotoDiv'; 

            categories[category].forEach((item, index) => {

                const icon = document.createElement('img');
                icon.className = 'categoryFoto';
                icon.src = item.link;

                div.appendChild(icon);

                if ((index + 1) % 3 === 0) {
                    panel.appendChild(div);
                    div = document.createElement('div');
                    div.className = 'rowCategoryFotoDiv';
                }
            });
            if (div.childNodes.length > 0) {
                panel.appendChild(div);
            }
        } else {
            panel.innerHTML = 'Категорія не знайдена';
        }
    }

    basket.addEventListener('click', function () {
        window.location = '/Goodmeal/User/ShoppingCart';
    });
});

//LoginRegister popUp

document.addEventListener("DOMContentLoaded", function() {
    const profileButton = document.getElementById("profile");
    const overlay = document.getElementById('overlay');
    const loginPopup = document.getElementById("loginPopup");
    const closePopupButton = document.getElementById("closePopup");
    const showRegisterLink = document.getElementById("showRegister");
    const showLoginLink = document.getElementById("showLogin");
    const loginForm = document.getElementById("loginPopup");
    const registerForm = document.getElementById("registerPopup");
    var dropdownMenu = document.querySelector('.dropdown-menu-fullscreen');
    var panel = document.getElementById('categoryPanel');

    profileButton.addEventListener("click", function () {
        dropdownMenu.classList.remove('show');
        panel.classList.remove('show');
        overlay.style.zIndex = 9998;
        console.log("Profile button clicked");
        loginPopup.style.display = "flex";
        overlay.style.display = 'block';
    });

    closePopupButton.addEventListener("click", function() {
        console.log("Close button clicked");
        loginPopup.style.display = "none";
        overlay.style.display = 'none';
        overlay.style.zIndex = 9990;
    });

    showRegisterLink.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Show Register link clicked");
        loginForm.style.display = "none";
        registerForm.style.display = "flex";
    });

    showLoginLink.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Show Login link clicked");
        registerForm.style.display = "none";
        loginForm.style.display = "flex";
    });

    window.addEventListener("click", function(event) {
        if (event.target === loginPopup) {
            console.log("Clicked outside the popup");
            loginPopup.style.display = "none";
        }
    });

    window.addEventListener("scroll", function() {
        const scrollY = window.scrollY;
        loginPopup.style.top = `${120 + scrollY}px`;
    });

    overlay.addEventListener('click', function () {
        panel.innerHTML = '';
        overlay.style.display = 'none';
        if (loginPopup.style.display != "flex") {
            dropdownMenu.classList.toggle('show');
            panel.classList.toggle('show');
        }
        overlay.style.zIndex = 9990;
        loginPopup.style.display = "none";
    });
});
