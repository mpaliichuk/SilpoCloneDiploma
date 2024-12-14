var dropdownToggle = document.getElementById('navbarDropdownMenuLink');
const overlay = document.getElementById('overlay');
var dropdownMenu = document.querySelector('.dropdown-menu-fullscreen');
var dropdownItems = document.getElementsByClassName('dropdown-item');
var panel = document.getElementById('categoryPanel');
const socialIcons = document.querySelectorAll('.socialIcons');
var categories = {};
var userCart = null;
const toastLiveExample = document.getElementById('liveToast');


document.addEventListener("DOMContentLoaded", function () {
    GetCart();
    userOrAdmin();
});

async function GetCategories() {
    var categoriesRespons = [];

    try {
        const response = await fetch("http://localhost:5152/gateway/Category", {
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
            categories[item.id] = {
                name: item.name,
                parentCategoryId: item.parentCategoryId,
                iconPath: item.iconPath
            };
        });

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function GetCart() {
    var userId = localStorage.getItem("userId");
    try {
        const response = await fetch("http://localhost:5152/gateway/GetUserCart/" + userId, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            var data = await response.json();
            if (localStorage.getItem("userId") != 0 && data.result != null) {
                if (data.result.cartHeader.userId == localStorage.getItem("userId"))
                    userCart = 1;
            }
            console.log("Enter");
        }

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
            generateCategoryCard(item.iconPath, item.name, index + 1); 
    });
    generateCategoryCard('/icons/CategoryIcons/AllProducts.png', 'Всі продукти', categoryId); 
}
/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
function generateCategoryCard(iconSrc, categoryText, id) {
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
    img.src = categories[id].iconPath;

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
    if (title.length > 2) {
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

function userOrAdmin() {
    const basketDiv = document.getElementById("basketDiv");
    const basketText = document.getElementById("basketText");
    const basketIcon = document.getElementById("basketIcon");
    if (basketText && basketIcon) {
        if (localStorage.getItem("userRole") === "Admin") {
            basketText.textContent = "Адмін панель";
            basketIcon.src = "/icons/Admin.png";

            basketDiv.addEventListener('click', function () {
                window.location.href = "/Admin/Index";
            });

            basketDiv.classList.add("adminDivClass");
            basketDiv.classList.remove("basketDivClass");
        } else {
            basketText.textContent = "Кошик";
            basketIcon.src = "/icons/Cart.png";
            basketDiv.addEventListener('click', handleBasketClick);
            basketDiv.classList.add("basketDivClass");
            basketDiv.classList.remove("adminDivClass");
        }
    }
}

function handleBasketClick() {
    GetCart();
    if (userCart == null) {
        GetRecommendedProducts();
        dropdownMenu?.classList.remove('show');
        panel?.classList.remove('show');
        setTimeout(() => {
            emptyCartPopUp?.classList.add('show');
        }, 10);
        overlayPopUp.style.zIndex = 9998;
        emptyCartPopUp.style.display = "flex";
        overlayPopUp.style.display = 'block';

        document.body.classList.add('no-scroll');
        emptyCartPopUp.focus();
    }
    else {
        window.location = ("/Goodmeal/User/ShoppingCart");
    }
}


//LoginRegister popUp /////////////////////////////////////////////////////////////////////////////////////////
const profileButton = document.getElementById("profile");
const loginPopup = document.getElementById("loginPopup");
const showRegisterLink = document.getElementById("showRegister");
const showLoginLink = document.getElementById("showLogin");

profileButton.addEventListener("click", function () {
    if (!localStorage.getItem("userName")) {
        dropdownMenu.classList.remove('show');
        panel.classList.remove('show');
        overlayPopUp.style.zIndex = 9998;
        loginPopup.style.display = "flex";
        overlayPopUp.style.display = 'block';
    }
    else {
        localStorage.removeItem("userName");
        localStorage.setItem("userId", 0);
        localStorage.removeItem("userRole");
        document.querySelector(".toast-body").innerHTML = "Вихід здійснено успішно";
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
        const profileSpan = document.querySelector("#headerDiv2 span");
        if (profileSpan) {
            profileSpan.textContent = "Увійти";
        }
        window.location.reload();
    }
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

registerButton.addEventListener("click", () => Register());
async function Register()
{
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

        if (response.ok) {
            Login(data.email, data.password);
            overlayPopUp.style.display = 'none';
            closeRegisterPopup();
            document.querySelector(".toast-body").innerHTML = "Реєстрація успішна! Виконується автоматичний вхід...";
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
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
}

function clearRegisterErrors() {
    document.getElementById("registerMessage").textContent = "";
    document.getElementById("registerMessage").style.display = "none";
}

loginButton.addEventListener("click", () => Login());
async function Login(email, password) {
    email = email || document.getElementById("loginEmail").value;
    password = password || document.getElementById("loginPassword").value;

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

        if (response.ok) {
            overlayPopUp.style.display = 'none';
            localStorage.setItem("userName", result.user.name);
            localStorage.setItem("userId", result.user.id);
            localStorage.setItem("userRole", result.user.role);

            closeLoginPopup();
            overlayPopUp.style.display = 'none';
            document.querySelector(".toast-body").innerHTML = "Вхід успішний!";
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();

            const profileSpan = document.getElementById("accountName");
            if (profileSpan) {
                profileSpan.textContent = `${result.user.name}(Вийти)` || "Акаунт";
            }
            window.location.reload();
        } else {
            loginErrorDiv.textContent = result.message || "Помилка входу. Перевірте емейл та пароль.";
            loginErrorDiv.style.display = "block";
        }
    } catch (error) {
        console.error("Error:", error);
        loginErrorDiv.textContent = "Помилка мережі при вході.";
        loginErrorDiv.style.display = "block";
    }
}

function displayLoginError(message) {
    loginErrorDiv.textContent = message;
    loginErrorDiv.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
        const profileSpan = document.getElementById("accountName");
        if (profileSpan) {
            profileSpan.textContent = savedName + "(Вийти)";
        }
    }
});

function closeRegisterPopup() {
    document.getElementById("registerPopup").style.display = "none";
    document.getElementById("overlayPopUp").style.display = "none";
}

function closeLoginPopup() {
    document.getElementById("loginPopup").style.display = "none";
    overlayPopUp.style.display = "none";

}

//document.getElementById("loginButton").addEventListener("click", loginUser);
//document.getElementById("registerButton").addEventListener("click", registerUser);

//async function loginUser() {
//    const email = document.getElementById("loginEmail").value;
//    const password = document.getElementById("loginPassword").value;

//    const response = await fetch(`${apiUrl}/login`, {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify({
//            email: email,
//            password: password
//        })
//    });

//    if (response.ok) {
//        const data = await response.json();
//        alert(data.message);

//        closeLoginPopup();

//        const profileSpan = document.querySelector("#headerDiv2 span");
//        if (profileSpan) {
//            profileSpan.textContent = `${data.name}(Вийти)`;
//        }
//    } else {
//        const errorData = await response.json();
//        loginErrorDiv.textContent = errorData.message || "Не вдалося увійти.";
//        loginErrorDiv.style.display = "block";
//    }
//}

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

async function submitOrder() {
    // Change orderData with real Data now it's dummy values
    const orderData = {
        customerId: 123, // Replace with the actual customer ID
        orderDate: new Date().toISOString(),
        orderItems: [
            { productId: 1, quantity: 2, price: 50 },
            { productId: 2, quantity: 1, price: 100 },
        ],
    };

    try {
        const response = await fetch('http://localhost:5087/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        if (response.ok) {
            const createdOrder = await response.json();
            document.querySelector(".toast-body").innerHTML = `Замовлення успішно оформлено! Номер замовлення: ${createdOrder.id}`;
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
        } else {
            const error = await response.json();
            document.querySelector(".toast-body").innerHTML = `Помилка при оформленні замовлення: ${error.message}`;
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
        }
    } catch (error) {
        console.error('Error:', error);
        document.querySelector(".toast-body").innerHTML = 'Сталася помилка під час оформлення замовлення.';
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    }
}
