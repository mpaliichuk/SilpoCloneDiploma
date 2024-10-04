var dropdownToggle = document.getElementById('navbarDropdownMenuLink');
const overlay = document.getElementById('overlay');
var dropdownMenu = document.querySelector('.dropdown-menu-fullscreen');
var dropdownItems = document.getElementsByClassName('dropdown-item');
var panel = document.getElementById('categoryPanel');
var basket = document.getElementById('basketDiv');
const socialIcons = document.querySelectorAll('.socialIcons');

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
    categoriesLogo.src = '/icons/ListHoverGreen.png';
});

dropdownToggle.addEventListener('mouseout', () => {
    categoriesLogo.src = '/icons/List.png'; 
});

const categories = {
    0: {
        name: 'Фрукти',
        icon: '/icons/CategoryIcons/SmallFruitIcon.png',
        items: [
            { name: 'Сезонні фрукти', link: '/icons/Cart.png' },
            { name: 'Ягоди', link: '/icons/Cart.png' },
            { name: 'Смузі та фреші', link: '/icons/Cart.png' },
            { name: 'Фруктові снеки', link: '/icons/Cart.png' },
            { name: 'Горіхи', link: '/icons/Cart.png' },
            { name: 'Всі продукти', link: '/icons/Cart.png' }
        ]
    },
    1: {
        name: 'Здорове харчування',
        icon: '/icons/CategoryIcons/SmallHealthyFoodIcon.png',
        items: [
            { name: 'Безлактозні продукти', link: '/icons/Cart.png' },
            { name: 'Веганські продукти', link: '/icons/Cart.png' },
            { name: 'Органічна їжа', link: '/icons/Cart.png' },
            { name: 'Безглютенові продукти', link: '/icons/Cart.png' },
            { name: 'Без додаткового цукру', link: '/icons/Cart.png' },
            { name: 'Всі продукти', link: '/icons/Cart.png' }
        ]
    },
    2: {
        name: 'Овочі',
        icon: '/icons/CategoryIcons/SmallVegetablesIcon.png',
        items: [
            { name: 'Сезонні овочі', link: '/icons/Cart.png' },
            { name: 'Зелень і салати', link: '/icons/Cart.png' },
            { name: 'Соління', link: '/icons/Cart.png' },
            { name: 'Гриби', link: '/icons/Cart.png' },
            { name: 'Всі продукти', link: '/icons/Cart.png' }
        ]
    },
    3:{
        name: 'Бакалія та консерви',
        icon: '/icons/CategoryIcons/SmallGroceryIcon.png',
        items: []
    },
    4: {
        name: 'Риба',
        icon: '/icons/CategoryIcons/SmallFishIcon.png',
        items: []
    },
    5: {
        name: 'Соуси та спеції',
        icon: '/icons/CategoryIcons/SmallSaucesIcon.png',
        items: []
    },
    6: {
        name: 'Мʼясо',
        icon: '/icons/CategoryIcons/SmallMeatIcon.png',
        items: []
    },
    7: {
        name: 'Солодощі',
        icon: '/icons/CategoryIcons/SmallSweetsIcon.png',
        items: []
    },
    8: {
        name: 'Снеки',
        icon: '/icons/CategoryIcons/SmallSnacksIcon.png',
        items: []
    },
    9: {
        name: 'Заморожені продукти',
        icon: '/icons/CategoryIcons/SmallFrozenFoodIcon.png',
        items: []
    },
    10: {
        name: 'Вода та напої',
        icon: '/icons/CategoryIcons/SmallWaterIcon.png',
        items: []
    },
    11: {
        name: 'Тютюнові вироби',
        icon: '/icons/CategoryIcons/SmallTobaccoIcon.png',
        items: []
    },
    12: {
        name: 'Алкогольні напої',
        icon: '/icons/CategoryIcons/SmallAlcoholIcon.png',
        items: []
    },
    13: {
        name: 'Гігієна та краса',
        icon: '/icons/CategoryIcons/SmallHygieneIcon.png',
        items: []
    },
    14: {
        name: 'Кава та чай',
        icon: '/icons/CategoryIcons/SmallCoffeeTeaIcon.png',
        items: []
    },
    15: {
        name: 'Товари для дому',
        icon: '/icons/CategoryIcons/SmallHomeGoodsIcon.png',
        items: []
    },
    16: {
        name: 'Товари для дітей',
        icon: '/icons/CategoryIcons/SmallChildrensGoodsIcon.png',
        items: []
    },
    17: {
        name: 'Молочні продукти',
        icon: '/icons/CategoryIcons/SmallDairyProductsIcon.png',
        items: []
    },
};
var delay = 200;
var hoverTimeout;

function generateCategoryInitialisator() {
    const categoryList = document.querySelector('.category-list');
    categoryList.innerHTML = '';
    const categoryValues = Object.values(categories);

    for (var categoryId = 0; categoryId < categoryValues.length; categoryId++) {
        createCategoryItem('#', categoryId);
    }

    for (var categoryId = 0; categoryId < dropdownItems.length; categoryId++) {
        dropdownItems[categoryId].addEventListener('mouseenter', function (event) {
            event.preventDefault();
            const img = event.target.querySelector('.miniCategoryIcon');
            if (!img.dataset.originalSrc) {
                img.dataset.originalSrc = img.src;
            }
            img.src = img.src.replace('/icons/CategoryIcons\/', '/icons/CategoryIcons/Hover');
            hoverTimeout = setTimeout(() => {
                generateCategoryPanel(event.target.id);
            }, delay);
        });

        dropdownItems[categoryId].addEventListener('mouseleave', function (event) {
                event.preventDefault();
                clearTimeout(hoverTimeout);
                const img = event.target.querySelector('.miniCategoryIcon');
                if (img.dataset.originalSrc) {
                    img.src = img.dataset.originalSrc;
                }
            });
    }
}

function generateCategoryPanel(categoryId) {
    panel.innerHTML = '';
    if (categories[categoryId].items.length > 0) {
        categories[categoryId].items.forEach((item) => {
            generateCategoryCard(item.link, item.name);    
        });
    } else {
        generateCategoryCard('/icons/Cart.png', 'Всі продукти'); 
    }
}
/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
function generateCategoryCard(iconSrc, categoryText) {
    const categoryDivCard = document.createElement('div');
    categoryDivCard.className = 'categoryDivCard';

    const categorIconDiv = document.createElement('div');
    categorIconDiv.className = 'categorIconDiv';

    const icon = document.createElement('img');
    icon.className = 'categortIcon';
    icon.src = iconSrc;

    categorIconDiv.appendChild(icon);

    const categorTextDiv = document.createElement('div');
    categorTextDiv.className = 'categorTextDiv';

    const text = document.createElement('span');
    text.className = 'categoryText';
    text.textContent = categoryText;

    categorTextDiv.appendChild(text);

    categoryDivCard.appendChild(categorIconDiv);
    categoryDivCard.appendChild(categorTextDiv);

    panel.appendChild(categoryDivCard);

    categoryDivCard.addEventListener('mouseenter', function () {
        categoryDivCard.querySelector('.categorIconDiv').style.background = '#4CAF50';
        categoryDivCard.style.border = '3px solid #4CAF50';
        categoryDivCard.querySelector('.categoryText').style.color = '#4CAF50';
    });

    categoryDivCard.addEventListener('mouseleave', function () {
        categoryDivCard.querySelector('.categorIconDiv').style.background = '#FF5722';
        categoryDivCard.style.border = '3px solid #FF5722';
        categoryDivCard.querySelector('.categoryText').style.color = '#FF5722';
    });
}
function createCategoryItem(href, id) {
    const categoryList = document.querySelector('.category-list');

    const categoryItem = document.createElement('a');
    categoryItem.classList.add('dropdown-item', 'category-item');
    categoryItem.href = href;
    categoryItem.id = id;

    const img = document.createElement('img');
    img.classList.add('miniCategoryIcon');
    img.src = categories[id].icon;

    const textNode = document.createTextNode(categories[id].name);

    categoryItem.appendChild(img);
    categoryItem.appendChild(textNode);

    categoryList.appendChild(categoryItem);
}
/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

basket.addEventListener('click', function () {
    window.location = '/Goodmeal/User/ShoppingCart';
});

socialIcons.forEach((item) => {
    item.addEventListener('mouseenter', function () {
        if (!item.dataset.originalSrc) {
            item.dataset.originalSrc = item.src;
        }
        item.src = item.src.replace(/icons\//, 'icons/Hover');
    });

    item.addEventListener('mouseleave', function () {
        if (item.dataset.originalSrc) {
            item.src = item.dataset.originalSrc;
        }
    });
});


//LoginRegister popUp
const profileButton = document.getElementById("profile");
const overlayRegister = document.getElementById('overlay');
const loginPopup = document.getElementById("loginPopup");
const closePopupButton = document.getElementById("closePopup");
const showRegisterLink = document.getElementById("showRegister");
const showLoginLink = document.getElementById("showLogin");
const loginForm = document.getElementById("loginPopup");
const registerForm = document.getElementById("registerPopup");

profileButton.addEventListener("click", function () {
    dropdownMenu.classList.remove('show');
    panel.classList.remove('show');
    overlayRegister.style.zIndex = 9998;
    console.log("Profile button clicked");
    loginPopup.style.display = "flex";
    overlayRegister.style.display = 'block';
});

//closePopupButton.addEventListener("click", function() {
//    console.log("Close button clicked");
//    loginPopup.style.display = "none";
//    overlayRegister.style.display = 'none';
//    overlayRegister.style.zIndex = 9990;
//});

//showRegisterLink.addEventListener("click", function(event) {
//    event.preventDefault();
//    console.log("Show Register link clicked");
//    loginForm.style.display = "none";
//    registerForm.style.display = "flex";
//});

//showLoginLink.addEventListener("click", function(event) {
//    event.preventDefault();
//    console.log("Show Login link clicked");
//    registerForm.style.display = "none";
//    loginForm.style.display = "flex";
//});

window.addEventListener("click", function(event) {
    if (event.target === loginPopup) {
        console.log("Clicked outside the popup");
        loginPopup.style.display = "none";
    }
});

overlayRegister.addEventListener('click', function () {
    panel.innerHTML = '';
    overlayRegister.style.display = 'none';
    if (loginPopup.style.display != "flex") {
        dropdownMenu.classList.toggle('show');
        panel.classList.toggle('show');
    }
    overlayRegister.style.zIndex = 9990;
    loginPopup.style.display = "none";
});
