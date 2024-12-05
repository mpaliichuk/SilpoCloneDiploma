var dropdownToggle = document.getElementById('navbarDropdownMenuLink');
const overlay = document.getElementById('overlay');
var dropdownMenu = document.querySelector('.dropdown-menu-fullscreen');
var dropdownItems = document.getElementsByClassName('dropdown-item');
var panel = document.getElementById('categoryPanel');
const socialIcons = document.querySelectorAll('.socialIcons');

var categories = {
    1: { name: '', icon: '/icons/CategoryIcons/SmallFruitIcon.png', parentCategoryId: null },
    2: { name: '', link: '/icons/CategoryIcons/SeasonalFruits.png', parentCategoryId: 0 },
    3: { name: '', link: '/icons/CategoryIcons/Smoothies.png', parentCategoryId: 0 },
    4: { name: '', link: '/icons/CategoryIcons/FruitSnacks.png', parentCategoryId: 0 },
    5: { name: '', link: '/icons/CategoryIcons/Berries.png', parentCategoryId: 0 },
    6: { name: '', link: '/icons/CategoryIcons/Nuts.png', parentCategoryId: 0 },

    7: { name: '', icon: '/icons/CategoryIcons/SmallHealthyFoodIcon.png', parentCategoryId: null },
    8: { name: '', link: '/icons/CategoryIcons/Lactose-free.png', parentCategoryId: 0 },
    9: { name: '', link: '/icons/CategoryIcons/Vegan.png', parentCategoryId: 0 },
    10: { name: '', link: '/icons/CategoryIcons/Organic.png', parentCategoryId: 0 },
    11: { name: '', link: '/icons/CategoryIcons/Gluten-free.png', parentCategoryId: 0 },
    12: { name: '', link: '/icons/CategoryIcons/NoAddedSugar.png', parentCategoryId: 0 },

    13: { name: '', icon: '/icons/CategoryIcons/SmallVegetablesIcon.png', parentCategoryId: null },
    14: { name: '', link: '/icons/CategoryIcons/SeasonalVegetables.png', parentCategoryId: 0 },
    15: { name: '', link: '/icons/CategoryIcons/GreensAndSalads.png', parentCategoryId: 0 },
    16: { name: '', link: '/icons/CategoryIcons/Pickles.png', parentCategoryId: 0 },
    17: { name: '', link: '/icons/CategoryIcons/Mushrooms.png', parentCategoryId: 0 },

    18: { name: 'Бакалія та консерви', icon: '/icons/CategoryIcons/SmallGroceryIcon.png', parentCategoryId: null },
    19: { name: 'Риба', icon: '/icons/CategoryIcons/SmallFishIcon.png', parentCategoryId: null },
    20: { name: 'Соуси та спеції', icon: '/icons/CategoryIcons/SmallSaucesIcon.png', parentCategoryId: null },
    21: { name: 'Мʼясо', icon: '/icons/CategoryIcons/SmallMeatIcon.png', parentCategoryId: null },
    22: { name: 'Солодощі', icon: '/icons/CategoryIcons/SmallSweetsIcon.png', parentCategoryId: null },
    23: { name: 'Снеки', icon: '/icons/CategoryIcons/SmallSnacksIcon.png', parentCategoryId: null },
    24: { name: 'Заморожені продукти', icon: '/icons/CategoryIcons/SmallFrozenFoodIcon.png', parentCategoryId: null },
    25: { name: 'Вода та напої', icon: '/icons/CategoryIcons/SmallWaterIcon.png', parentCategoryId: null },
    26: { name: 'Тютюнові вироби', icon: '/icons/CategoryIcons/SmallTobaccoIcon.png', parentCategoryId: null },
    27: { name: 'Алкогольні напої', icon: '/icons/CategoryIcons/SmallAlcoholIcon.png', parentCategoryId: null },
    28: { name: 'Гігієна та краса', icon: '/icons/CategoryIcons/SmallHygieneIcon.png', parentCategoryId: null },
    29: { name: 'Кава та чай', icon: '/icons/CategoryIcons/SmallCoffeeTeaIcon.png', parentCategoryId: null },
    30: { name: 'Товари для дому', icon: '/icons/CategoryIcons/SmallHomeGoodsIcon.png', parentCategoryId: null },
    31: { name: 'Товари для дітей', icon: '/icons/CategoryIcons/SmallChildrensGoodsIcon.png', parentCategoryId: null },
    32: { name: 'Молочні продукти', icon: '/icons/CategoryIcons/SmallDairyProductsIcon.png', parentCategoryId: null },
};

async function GetCategories() {
    var categoriesRespons = [];

    try {
        const response = await fetch("http://localhost:5152/gateway/AllCategories", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            categoriesRespons = await response.json();
        }

        categoriesRespons.forEach(item => {
            categories[item.id].name = item.name;
            categories[item.id].parentCategoryId = item.parentCategoryId;
        });

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function FindProduct(title) {
    try {
        const response = await fetch("http://localhost:5152/gateway/SearchProducts/" + title, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            responseItem = await response.json();
            console.log(responseItem);
            var productId = responseItem.id;
            window.location = "/Goodmeal/ProductPage/" + productId;;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

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

var delay = 300;
var hoverTimeout;
var elementBefore;

async function generateCategoryInitialisator() {
    await GetCategories();
    const categoryList = document.querySelector('.category-list');
    categoryList.innerHTML = '';
    const categoryValues = Object.values(categories);

    for (var categoryId = 1; categoryId <= categoryValues.length; categoryId++) {
        if (categories[categoryId].parentCategoryId == null) {
            createCategoryItem(`/Goodmeal/Category/${categoryId}`, categoryId);
        }
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
    const categoryItems = Array.isArray(categories) ? categories : Object.values(categories);
    categoryItems.forEach((item, index) => {
        if (item.parentCategoryId == categoryId)
            generateCategoryCard(item.link, item.name, index + 1);    
    });
    generateCategoryCard('/icons/CategoryIcons/AllProducts.png', 'Всі продукти', categoryId); 
}
/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
function generateCategoryCard(iconSrc, categoryText, id) {
    console.log(id);
    const categoryDivCard = document.createElement('a');
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

///Find////
var search = document.getElementById("searchText");
var searchIcon = document.getElementById("searchIcon");

search.addEventListener('keyup', event => {
    if (event.code === 'Enter') {
        find(search.value);
    }
});

searchIcon.addEventListener("click", function (event) {
    find(search.value);
});

function find(title) {
    if (title.length > 3) {
        FindProduct(title);
    }  
}

///

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
            sale: productsByCategory[i].discount,
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

//Register/Login backend
const apiUrl = "http://localhost:5145/api/Auth";

const loginButton = document.querySelector(".login-button");
const registerButton = document.querySelector("#registerPopup .login-button");

const loginErrorDiv = document.createElement("div");
loginErrorDiv.style.color = "red";
loginErrorDiv.style.marginTop = "10px";
loginErrorDiv.style.display = "none";
loginButton.insertAdjacentElement("afterend", loginErrorDiv);

const registerErrorDiv = document.createElement("div");
registerErrorDiv.style.color = "red";
registerErrorDiv.style.marginTop = "10px";
registerErrorDiv.style.display = "none";
registerButton.insertAdjacentElement("afterend", registerErrorDiv);

showRegisterLink.addEventListener("click", function () {
    document.getElementById("loginPopup").style.display = "none";
    document.getElementById("registerPopup").style.display = "flex";
});

showLoginLink.addEventListener("click", function () {
    document.getElementById("registerPopup").style.display = "none";
    document.getElementById("loginPopup").style.display = "flex";
});

registerButton.addEventListener("click", async function () {
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const data = {
        name: name,
        email: email,
        password: password,
        surname: "TestSurname",
        phoneNumber: "0123456789",
    };

    try {
        const response = await fetch(`${apiUrl}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Register Response:", result);

        if (response.ok) {
            alert("Registration successful! Please log in.");
            overlayPopUp.style.display = 'none';
            closeRegisterPopup();
        } else {
            clearRegisterErrors();

            if (result.errors) {
                for (const [field, messages] of Object.entries(result.errors)) {
                    const errorElement = document.getElementById("registerMessage");
                    errorElement.textContent += `${field.charAt(0).toUpperCase() + field.slice(1)}: ${messages.join(', ')}` + "\n";
                    errorElement.style.display = "block";
                }
            } else {
                document.getElementById("registerMessage").textContent = result.message || "Registration failed.";
                document.getElementById("registerMessage").style.display = "block";
            }
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("registerMessage").textContent = "Network error during registration.";
        document.getElementById("registerMessage").style.display = "block";
    }
});

function clearRegisterErrors() {
    document.getElementById("registerMessage").textContent = "";
    document.getElementById("registerMessage").style.display = "none";
}

loginButton.addEventListener("click", async function () {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const data = {
        email: email,
        password: password
    };

    try {
        loginErrorDiv.style.display = "none";
        loginErrorDiv.textContent = "";

        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Login Response:", result);

        if (response.ok) {
            overlayPopUp.style.display = 'none';
            localStorage.setItem("userName", result.user.name);

            closeLoginPopup();
            overlayPopUp.style.display = 'none';

            const profileSpan = document.getElementById("accountName");
            if (profileSpan) {
                profileSpan.textContent = result.user.name || "Акаунт";
            }
        } else {
            loginErrorDiv.textContent = result.message || "Помилка входу. Перевірте емейл та пароль.";
            loginErrorDiv.style.display = "block";
        }
    } catch (error) {
        console.error("Error:", error);
        loginErrorDiv.textContent = "Помилка мережі при вході.";
        loginErrorDiv.style.display = "block";
    }
});

function displayLoginError(message) {
    loginErrorDiv.textContent = message;
    loginErrorDiv.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
        const profileSpan = document.getElementById("accountName");
        if (profileSpan) {
            profileSpan.textContent = savedName;
        }
    }
});

function closeRegisterPopup() {
    document.getElementById("registerPopup").style.display = "none";
    document.getElementById("overlayPopUp").style.display = "none";
}

function closeLoginPopup() {
    document.getElementById("loginPopup").style.display = "none";
    document.getElementById("overlayPopUp").style.display = "none";
}

document.getElementById("loginButton").addEventListener("click", loginUser);
document.getElementById("registerButton").addEventListener("click", registerUser);

async function loginUser() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (response.ok) {
        const data = await response.json();
        const userName = data.name;

        closeLoginPopup();

        const profileSpan = document.querySelector("#headerDiv2 span");
        if (profileSpan) {
            profileSpan.textContent = userName;
        }
    } else {
        const errorData = await response.json();
        loginErrorDiv.textContent = errorData.message || "Не вдалося увійти.";
        loginErrorDiv.style.display = "block";
    }
}

function displayLoginError(message) {
    const loginErrorElement = document.getElementById("loginError");
    if (!loginErrorElement) {
        const errorElement = document.createElement("div");
        errorElement.id = "loginError";
        errorElement.textContent = message;
        errorElement.style.color = "red";
        errorElement.style.marginTop = "10px";
        document.querySelector(".login-form").appendChild(errorElement);
    } else {
        loginErrorElement.textContent = message;
    }
}

//OrderPage scripts
function updateCharacterCount() {
    const input = document.getElementById('courierComment');
    const countDisplay = document.getElementById('characterCount');
    const currentLength = input.value.length;
    countDisplay.textContent = `${currentLength}/200`;
}
function editText() {
    const textElement = document.getElementById('addressText');

    if (textElement.tagName === 'SPAN') {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = textElement.innerText;
        input.style.width = "300px";
        input.onblur = function () {
            textElement.innerText = input.value;
            input.replaceWith(textElement);
        };
        textElement.replaceWith(input);
        input.focus();
    }
}
function selectOption(selectedElement) {
    const allRadioButtons = document.querySelectorAll('.RadioButton');
    allRadioButtons.forEach((radioButton) => {
        radioButton.classList.remove('selected');
    });

    const selectedRadioButton = selectedElement.querySelector('.RadioButton');
    selectedRadioButton.classList.add('selected');
}
function selectTime(element) {
    document.querySelectorAll('.time-option').forEach(option => option.classList.remove('selected'));
    element.classList.add('selected');
    document.getElementById('customTimeInput').style.display = 'none';
}

function selectCustomTime(element) {
    document.querySelectorAll('.time-option').forEach(option => option.classList.remove('selected'));
    element.classList.add('selected');
    const customTimeInput = document.getElementById('customTimeInput');
    customTimeInput.style.display = 'block';
    customTimeInput.focus();
}

function finalizeCustomTime() {
    const customTimeInput = document.getElementById('customTimeInput');
    const customTimeText = customTimeInput.value;
    if (customTimeText) {
        const customTimeOption = document.querySelector('.time-option.selected');
        customTimeOption.querySelector('div').innerText = customTimeText;
    }
    customTimeInput.style.display = 'none';
}
function showPopup() {
    document.getElementById('orderPopup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('orderPopup').style.display = 'none';
}
