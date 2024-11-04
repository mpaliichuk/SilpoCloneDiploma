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
    closeCartPopUpEvent();
});
function closeCartPopUpEvent() {
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
    document.getElementById("subRecommendedProducts").innerHTML = "";
}


//Cart popUp //////////////////////////////////////////////////////////////////////////////////////////////////
const emptyCartPopUp = document.getElementById('emptyCartPopUp');
const basket = document.getElementById('basketDiv');

//basket.addEventListener('click', function () {
//    window.location = '/Goodmeal/User/ShoppingCart';
//});

basket.addEventListener('click', function () {
    GetRecommendedProducts();
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

async function GetRecommendedProducts() {
    var productsByCategory = [];

    try {
        const response = await fetch("http://localhost:5152/gateway/RecommendedProducts", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            productsByCategory = await response.json();
            //productsByCategory.forEach(product => {
            //    const productCard = createpopUpProductCard(product);
            //    document.getElementById('subProductsDiv').appendChild(productCard);
            //});
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

    var isFirstBool = false;
    for (var i = 0; i < 8; i++) {
        if (i == 0) {
            isFirstBool = true;
        }
        const productCard = createpopUpProductCard({
            productIconSrc: productsByCategory[i].imageUrls[0],
            productName: productsByCategory[i].title,
            productFullName: productsByCategory[i].productComposition,
            price: productsByCategory[i].price,
            sale: productsByCategory[i].sale,
            productId: productsByCategory[i].id,
            isFirst: isFirstBool
        });
        document.getElementById('subRecommendedProducts').appendChild(productCard);
        isFirstBool = false;
    }
    popUpCardFunctionality();
    popUpproductsSwitch();
}
function createpopUpProductCard({ productIconSrc, productName, productFullName,
    price, sale, productId, isFirst, discountIconSrc = '/icons/Discount.png' }) {
    const PopUpCardDiv = document.createElement('div');
    PopUpCardDiv.id = `${productId}`;
    PopUpCardDiv.className = 'popUpCardDiv';
    //PopUpCardDiv.setAttribute("product-id", productId);

    const productIconDiv = document.createElement('div');
    productIconDiv.className = 'productIconDiv no-select';

    if (sale > 0) {
        const discountIcon = document.createElement('img');
        discountIcon.className = 'discountIcon no-select no-drag';
        discountIcon.src = discountIconSrc;
        productIconDiv.appendChild(discountIcon);
    }

    const productIcon = document.createElement('img');
    productIcon.className = 'productIcon';
    productIcon.src = productIconSrc;

    productIconDiv.appendChild(productIcon);

    const productInfoDiv = document.createElement('div');
    productInfoDiv.className = 'productInfoDiv';

    const productNameDiv = document.createElement('div');
    productNameDiv.className = 'productNameDiv no-select';

    const productNameElement = document.createElement('div');
    productNameElement.className = 'productName';
    productNameElement.textContent = productName;

    const productFullNameElement = document.createElement('div');
    productFullNameElement.className = 'productFullName';
    productFullNameElement.textContent = productFullName;

    productNameDiv.appendChild(productNameElement);
    productNameDiv.appendChild(productFullNameElement);

    const priceDiv = document.createElement('div');
    priceDiv.className = 'priceDiv no-select';

    if (sale > 0) {
        const subPriceDiv = document.createElement('div');
        subPriceDiv.className = 'subPriceDiv';
        const discountedPrice = price - (price * (sale / 100));
        subPriceDiv.innerHTML = `<b>${discountedPrice % 1 === 0 ? discountedPrice.toFixed(0) : discountedPrice.toFixed(2)}</b><span>грн</span>`;

        const crossTextDiv = document.createElement('div');
        crossTextDiv.className = 'crossTextDiv';
        crossTextDiv.innerHTML = `<span>${price} грн</span>`;

        priceDiv.appendChild(subPriceDiv);
        priceDiv.appendChild(crossTextDiv);
    }
    else {
        const subPriceDiv = document.createElement('div');
        subPriceDiv.className = 'subPriceDiv';
        subPriceDiv.innerHTML = `<b>${price}</b><span>грн</span>`;

        priceDiv.appendChild(subPriceDiv);
    }

    productInfoDiv.appendChild(productNameDiv);
    productInfoDiv.appendChild(priceDiv);

    PopUpCardDiv.appendChild(productIconDiv);
    PopUpCardDiv.appendChild(productInfoDiv);

    const carouselPopUpCardDiv = document.createElement('div');
    if (isFirst) {
        carouselPopUpCardDiv.className = 'carousel-item active';
    }
    else {
        carouselPopUpCardDiv.className = 'carousel-item';
    }
    carouselPopUpCardDiv.appendChild(PopUpCardDiv);

    return carouselPopUpCardDiv;
}
function popUpCardFunctionality() {
    const popUpCardDivs = document.querySelectorAll('.popUpCardDiv');

    popUpCardDivs.forEach(item => {
        item.addEventListener('click', function (event) {
            var productId = item.id;
            window.location = "/Goodmeal/ProductPage/" + productId;
        });
        item.addEventListener('mouseenter', function () {
            item.style.border = '3px solid #FF5722';

            const button = item.getElementsByClassName('productBuyBtn')[0];
            if (button) {
                button.style.background = '#FF5722';
            }
        });

        item.addEventListener('mouseleave', function () {
            item.style.border = '3px solid #53B06C';

            const button = item.getElementsByClassName('productBuyBtn')[0];
            if (button) {
                button.style.background = '#53B06C';
            }
        });
    });
}
function popUpproductsSwitch() {
    var carouselInner = document.getElementById('subRecommendedProducts');
    var cardWidth = document.querySelector('.carousel-item').offsetWidth;
    var scrollItem = cardWidth + 22;
    var scrollPosition = 0;
    var carouselScrollWidth = carouselInner.scrollWidth;
    var carouselWidth = carouselInner.offsetWidth;

    document.getElementById('recommendButtonNext').addEventListener('click', function () {
        if (scrollPosition + carouselWidth < carouselScrollWidth) {
            scrollPosition += scrollItem;
            if (scrollPosition + carouselWidth > carouselScrollWidth) {
                scrollPosition = carouselScrollWidth - carouselWidth;
            }
            carouselInner.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    });

    document.getElementById('recommendButtonPrev').addEventListener('click', function () {
        if (scrollPosition > 0) {
            scrollPosition -= scrollItem;
            if (scrollPosition < 0) scrollPosition = 0;
            carouselInner.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    });
}

document.getElementById('cancel').addEventListener('click', function () {
    closeCartPopUpEvent();
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
    loginPopup.style.display = "flex";
    overlayPopUp.style.display = 'block';
});

//Show Register/Login
document.getElementById("showRegister").addEventListener("click", function () {
    document.getElementById("loginPopup").style.display = "none";
    document.getElementById("registerPopup").style.display = "flex";
});

document.getElementById("showLogin").addEventListener("click", function () {
    document.getElementById("registerPopup").style.display = "none";
    document.getElementById("loginPopup").style.display = "flex";
});

showRegisterLink.addEventListener("click", function () {
    loginPopup.style.display = "none";
    registerPopup.style.display = "flex";
});

showLoginLink.addEventListener("click", function () {
    registerPopup.style.display = "none";
    loginPopup.style.display = "flex";
});

window.addEventListener("click", function(event) {
    if (event.target === overlayPopUp) {
        loginPopup.style.display = "none";
        registerPopup.style.display = "none";
        overlayPopUp.style.display = 'none';
    }
});

