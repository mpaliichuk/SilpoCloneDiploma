document.addEventListener('DOMContentLoaded', function () {
    var dropdownToggle = document.getElementById('navbarDropdownMenuLink');
    var dropdownMenu = document.querySelector('.dropdown-menu-fullscreen');
    var dropdownItems = document.getElementsByClassName('dropdown-item');
    var panel = document.getElementById('categoryPanel');

    dropdownToggle.addEventListener('click', function (event) {
        event.preventDefault();
        dropdownMenu.classList.toggle('show');
        panel.classList.toggle('show');
        if (panel.classList.contains('show'))
        {
            generateCategoryInitialisator();
        }
        else {
            panel.innerHTML = '';
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
});