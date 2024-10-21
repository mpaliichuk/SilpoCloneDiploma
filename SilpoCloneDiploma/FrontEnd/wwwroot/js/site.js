var dropdownToggle = document.getElementById('navbarDropdownMenuLink');
const overlay = document.getElementById('overlay');
var dropdownMenu = document.querySelector('.dropdown-menu-fullscreen');
var dropdownItems = document.getElementsByClassName('dropdown-item');
var panel = document.getElementById('categoryPanel');
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
            { name: 'Сезонні фрукти', link: '/icons/CategoryIcons/SeasonalFruits.png', route: 'SeasonalFruits' },
            { name: 'Ягоди', link: '/icons/CategoryIcons/Berries.png', route: 'Berries' },
            { name: 'Смузі та фреші', link: '/icons/CategoryIcons/Smoothies.png', route: 'Smoothies' },
            { name: 'Фруктові снеки', link: '/icons/CategoryIcons/FruitSnacks.png', route: 'FruitSnacks' },
            { name: 'Горіхи', link: '/icons/CategoryIcons/Nuts.png', route: 'Nuts' },
            { name: 'Всі продукти', link: '/icons/CategoryIcons/AllProducts.png', route: '' }
        ]
    },
    1: {
        name: 'Здорове харчування',
        icon: '/icons/CategoryIcons/SmallHealthyFoodIcon.png',
        items: [
            { name: 'Безлактозні продукти', link: '/icons/CategoryIcons/Lactose-free.png', route: 'Lactose-free' },
            { name: 'Веганські продукти', link: '/icons/CategoryIcons/Vegan.png', route: 'Vegan' },
            { name: 'Органічна їжа', link: '/icons/CategoryIcons/Organic.png', route: 'Organic' },
            { name: 'Безглютенові продукти', link: '/icons/CategoryIcons/Gluten-free.png', route: 'Gluten-free' },
            { name: 'Без додаткового цукру', link: '/icons/CategoryIcons/NoAddedSugar.png', route: 'NoAddedSugar' },
            { name: 'Всі продукти', link: '/icons/CategoryIcons/AllProducts.png', route: '' }
        ]
    },
    2: {
        name: 'Овочі',
        icon: '/icons/CategoryIcons/SmallVegetablesIcon.png',
        items: [
            { name: 'Сезонні овочі', link: '/icons/CategoryIcons/SeasonalVegetables.png', route: 'SeasonalVegetables' },
            { name: 'Зелень і салати', link: '/icons/CategoryIcons/GreensAndSalads.png', route: 'GreensAndSalads' },
            { name: 'Соління', link: '/icons/CategoryIcons/Pickles.png', route: 'Pickles' },
            { name: 'Гриби', link: '/icons/CategoryIcons/Mushrooms.png', route: 'Mushrooms' },
            { name: 'Всі продукти', link: '/icons/CategoryIcons/AllProducts.png', route: '' }
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
var delay = 300;
var hoverTimeout;
var elementBefore;

function generateCategoryInitialisator() {
    const categoryList = document.querySelector('.category-list');
    categoryList.innerHTML = '';
    const categoryValues = Object.values(categories);

    for (var categoryId = 0; categoryId < categoryValues.length; categoryId++) {
        createCategoryItem(`/Goodmeal/Category/${categoryId}`, categoryId);
    }

    for (var categoryId = 0; categoryId < dropdownItems.length; categoryId++) {
        dropdownItems[categoryId].addEventListener('mouseenter', function (event) {
            event.preventDefault();      
            hoverTimeout = setTimeout(() => {
                if (elementBefore) {
                    elementBefore.style.background = "#FFF6F3";
                    elementBefore.style.color = "#FF5722";
                    const img = elementBefore.querySelector('.miniCategoryIcon');
                    if (img.dataset.originalSrc) {
                        img.src = img.dataset.originalSrc;
                    }
                    elementBefore = null;
                }  

                const img = event.target.querySelector('.miniCategoryIcon');
                if (!img.dataset.originalSrc) {
                    img.dataset.originalSrc = img.src;
                }
                img.src = img.src.replace('/icons/CategoryIcons\/', '/icons/CategoryIcons/Hover');

                event.target.style.background = "#FF5722";
                event.target.style.color = "#FFFEFE";
                elementBefore = event.target;
                generateCategoryPanel(event.target.id);

            }, delay);
        });

        dropdownItems[categoryId].addEventListener('mouseleave', function (event) {
            event.preventDefault();
            clearTimeout(hoverTimeout);       
        });
    }
}

function generateCategoryPanel(categoryId) {
    panel.innerHTML = '';
    if (categories[categoryId].items.length > 0) {
        categories[categoryId].items.forEach((item) => {
            generateCategoryCard(item.link, item.name, categoryId, item.route);    
        });
    } else {
        generateCategoryCard('/icons/CategoryIcons/AllProducts.png', 'Всі продукти', categoryId); 
    }
}
/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
function generateCategoryCard(iconSrc, categoryText, id, route) {
    const categoryDivCard = document.createElement('a');
    if (route)
        categoryDivCard.href = `/Goodmeal/Category/${id}/${route}`;
    else
        categoryDivCard.href = `/Goodmeal/Category/${id}`;

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

//Overlay /////////////////////////////////////////////////////////////////////////////////////////////////////
const overlayPopUp = document.getElementById('overlay');
overlayPopUp.addEventListener('click', function () {
    emptyCartPopUp.classList.remove('show');
    setTimeout(() => {
        emptyCartPopUp.style.display = "none";
    }, 300);
    panel.innerHTML = '';
    overlayPopUp.style.display = 'none';
    if (dropdownMenu.classList.contains('show')) {
        dropdownMenu.classList.toggle('show');
        panel.classList.toggle('show');
    }
    overlayPopUp.style.zIndex = 9990;
    overlayPopUp.style.display = "none";
    loginPopup.style.display = "none";
    document.body.classList.remove('no-scroll');
});


//Cart popUp //////////////////////////////////////////////////////////////////////////////////////////////////
const emptyCartPopUp = document.getElementById('emptyCartPopUp');
const basket = document.getElementById('basketDiv');

//basket.addEventListener('click', function () {
//    window.location = '/Goodmeal/User/ShoppingCart';
//});

basket.addEventListener('click', function () {
    dropdownMenu.classList.remove('show');
    panel.classList.remove('show');
    setTimeout(() => {
        emptyCartPopUp.classList.add('show');
    }, 10);
    overlayPopUp.style.zIndex = 9998;
    emptyCartPopUp.style.display = "flex";
    overlayPopUp.style.display = 'block';

    document.body.classList.add('no-scroll');
    emptyCartPopUp.focus();
});


//LoginRegister popUp /////////////////////////////////////////////////////////////////////////////////////////
const profileButton = document.getElementById("profile");
const loginPopup = document.getElementById("loginPopup");
const closePopupButton = document.getElementById("closePopup");
const showRegisterLink = document.getElementById("showRegister");
const showLoginLink = document.getElementById("showLogin");
const registerForm = document.getElementById("registerPopup");

profileButton.addEventListener("click", function () {
    dropdownMenu.classList.remove('show');
    panel.classList.remove('show');
    overlayPopUp.style.zIndex = 9998;
    console.log("Profile button clicked");
    loginPopup.style.display = "flex";
    overlayPopUp.style.display = 'block';
});

//closePopupButton.addEventListener("click", function() {
//    console.log("Close button clicked");
//    loginPopup.style.display = "none";
//    overlayPopUp.style.display = 'none';
//    overlayPopUp.style.zIndex = 9990;
//});

//showRegisterLink.addEventListener("click", function(event) {
//    event.preventDefault();
//    console.log("Show Register link clicked");
//    loginPopup.style.display = "none";
//    registerForm.style.display = "flex";
//});

//showLoginLink.addEventListener("click", function(event) {
//    event.preventDefault();
//    console.log("Show Login link clicked");
//    registerForm.style.display = "none";
//    loginPopup.style.display = "flex";
//});

window.addEventListener("click", function(event) {
    if (event.target === loginPopup) {
        console.log("Clicked outside the popup");
        loginPopup.style.display = "none";
    }
});
