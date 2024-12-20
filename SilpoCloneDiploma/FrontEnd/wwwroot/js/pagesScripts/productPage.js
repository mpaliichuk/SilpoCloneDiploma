﻿var productId = document.getElementById("productId").value;
var categoryId = 0;

GetProduct(productId, categoryId);
async function GetProduct(productId, productCategoryId) {
    const response = await fetch("http://localhost:5152/gateway/Products/" + productId, {
         method: "GET",
         headers: {
             "Accept": "application/json",
             "Content-Type": "application/json"
         }
    });
    if (response.ok) {
        const responseProduct = await response.json();
        if (responseProduct.weight < 1)
            responseProduct.weight = `${responseProduct.weight * 1000} грам(мл)`;
        else
            responseProduct.weight = `${responseProduct.weight} кілограм`;

        let product = {
            id: productId,
            title: responseProduct.title,
            description: responseProduct.generalInformation,
            imageUrls: responseProduct.imageUrls,
            price: responseProduct.price,
            discountPercentage: responseProduct.discount,
            rating: responseProduct.averageRating,
            ratingCount: responseProduct.ratingCount,
            category_id: responseProduct.categoryId,
            attributes: [
                { key: "Торгова марка", value: responseProduct.tradeMark },
                { key: "Країна", value: responseProduct.countryOfManufacture },
                { key: "Вага", value: responseProduct.weight }
            ]
        };
        productCategoryId = responseProduct.categoryId;

        document.getElementById("productRouteName").innerText = product.title;
        document.getElementById("productTitle").innerText = product.title;
        document.getElementById("descriptionInfo").innerText = product.description;
        document.getElementById("productMainImg").src = product.imageUrls[0];
        document.getElementById("ratingScore").innerText = product.rating;
        document.getElementById("ratingCount").innerText = product.ratingCount + " оцінок";
        document.getElementById("ratingPopUpScore").innerText = product.rating;
        document.getElementById("ratingPopUpVotes").innerText = product.ratingCount + " оцінок";

        photoCount = product.imageUrls.length;
        if (photoCount > 1)
            document.getElementById("buttonPrev").classList = "noActiveButton";

        for (let i = 0; i < photoCount; i++) {
            var smallPhotoId = "productSmallImg" + (i + 1).toString();
            var child = createSmallRow(smallPhotoId, product.imageUrls[i], i + 1);
            document.querySelector('.small-row').appendChild(child);
        }
        document.getElementById("ratingScore").innerText = product.rating;

        /* Attributes work */

        if (product.attributes && product.attributes.length > 0) {
            const attributesDiv = document.getElementById("attributes");
            attributesDiv.innerHTML = "";
            product.attributes.forEach(attributeData => {
                const attribute = document.createElement('div');
                attribute.className = 'attribute';

                const attributeKeySpan = document.createElement('span');
                const attributeValueSpan = document.createElement('span');

                attributeKeySpan.innerText = attributeData.key;
                attributeValueSpan.innerText = attributeData.value;

                attribute.appendChild(attributeKeySpan);
                attribute.appendChild(attributeValueSpan);

                attributesDiv.appendChild(attribute);
            });
        }

        const discountedPrice = product.price - (product.price * (product.discountPercentage / 100));
        let finalPrice = discountedPrice % 1 === 0 ? discountedPrice.toFixed(0) : discountedPrice.toFixed(2);

        document.getElementById("productPrice").innerText = finalPrice + " грн";

        // if sale
        if (product.discountPercentage > 0) {
            const photosDiv = document.getElementsByClassName("photosDiv")[0];
            const img = document.createElement('img');
            img.className = "discountIconMainImg no-select no-drag";
            img.setAttribute("src", "/icons/Discount.png");
            photosDiv.appendChild(img);

            generatePriceNoDiscount(product.price, product.discountPercentage);
        }

        document.getElementById("addToCart").setAttribute("product-id", product.id);
        GetCategoryInfo(product.category_id);
        GetProductsBySameCategory(productCategoryId);
    }
}
async function GetProductsBySameCategory(productCategoryId) {
    var productsByCategory = [];

    try {
        const response = await fetch("http://localhost:5152/gateway/ProductsBySameCategory/" + productId + "/" + productCategoryId, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            productsByCategory = await response.json();
            //productsByCategory.forEach(product => {
            //    const productCard = createProductCard(product);
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
        const productCard = createProductCard({
            productIconSrc: productsByCategory[i].imageUrls[0],
            productName: productsByCategory[i].title,
            productFullName: productsByCategory[i].productComposition,
            price: productsByCategory[i].price,
            discount: productsByCategory[i].discount,
            productId: productsByCategory[i].id,
            count: productsByCategory[i].count,
            isFirst: isFirstBool
        });
        document.getElementById('subProductsDiv').appendChild(productCard);
        isFirstBool = false;
    }
    cardFunctionality();
    productsSwitch();
}

async function GetCategoryInfo(categoryId) {
    try {
        const response = await fetch("http://localhost:5152/gateway/Category/" + categoryId, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            categoryInfo = await response.json();

            var mainCategory = document.getElementById("productMainCategory");
            var subcategory = document.getElementById("productSubCategory");

            if (categoryInfo.parentCategoryId != 0) {
                mainCategory.innerText = categoryInfo.parentCategoryName;
                mainCategory.style.display = "flex";
                mainCategory.href = "/Goodmeal/Category/" + categoryInfo.parentCategoryId;
                subcategory.innerText = categoryInfo.name;
                subcategory.style.display = "flex";
                subcategory.href = "/Goodmeal/Category/" + categoryInfo.id;
                document.getElementById("productSubCategoryArrow").style.display = "flex";
            }
            else
                mainCategory.innerText = categoryInfo.name;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function AddProductInCart(productId, productCount, userId) {
    const userIdInt = userId.toString();
    const productIdInt = parseInt(productId, 10);
    const productCountInt = parseInt(productCount, 10);

    try {
        const response = await fetch("http://localhost:5152/gateway/AddToCart", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cartHeader: { userId: userIdInt },
                cartDetails: [
                    { productId: productIdInt, count: productCountInt }
                ]
            })
        });
        if (response.ok) {
            document.querySelector(".toast-body").innerHTML = "Товар додано в кошик!";
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
//Controls

function createSmallRow(id, src, count) {
    let photoDiv = document.createElement('div');
    if (count == 1)
        photoDiv.className = 'photo small selected';
    else
        photoDiv.className = 'photo small';

    let img = document.createElement('img');
    img.className = 'productPhoto smallPhoto';
    img.id = id;
    img.src = src;

    img.addEventListener('click', function (event) {
        if (!event.target.classList.contains('largePhoto') && !event.target.id.includes(photoPosition.toString())) {
            const largeContainer = document.querySelector('.large');
            const bigImg = largeContainer.querySelector('img');
            bigImg.src = event.target.src;

            cleerImgBorder();
            const photoSmallDiv = event.target.closest('.photo.small');
            photoSmallDiv.classList.add('selected');

            const imgId = event.target.id;
            const lastDigit = imgId.match(/\d+$/);
            photoPosition = lastDigit ? parseInt(lastDigit[0], 10) : null;

            updateButtons();
        }
    });

    photoDiv.appendChild(img);
    return photoDiv;
}
function generatePriceNoDiscount(oldPrice, discountPercentage) {
    const priceNoDiscountDiv = document.getElementById("priceNoDiscountDiv");

    const oldPriceSpan = document.createElement('span');
    oldPriceSpan.id = 'productOldPrice';
    oldPriceSpan.className = 'oldPrice';
    oldPriceSpan.innerText = oldPrice + ' грн';

    const discountDiv = document.createElement('div');
    discountDiv.className = 'discountPercentage';

    const percentageSpan = document.createElement('span');
    percentageSpan.id = 'percentage';
    percentageSpan.innerText = discountPercentage + '%';

    discountDiv.appendChild(percentageSpan);
    priceNoDiscountDiv.appendChild(oldPriceSpan);
    priceNoDiscountDiv.appendChild(discountDiv);

}
function createProductCard({ productIconSrc, productName, productFullName,
    price, sale, productId, count, isFirst, discountIconSrc = '/icons/Discount.png' }) {
    const cardDiv = document.createElement('div');
    cardDiv.id = `${productId}`;
    cardDiv.className = 'cardDiv';
    //if (count < 1) {
    //    cardDiv.classList.add('soldOut');
    //}
    //cardDiv.setAttribute("product-id", productId);

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

    const productControlDiv = document.createElement('div');
    productControlDiv.className = 'productControlDiv';

    const productCountDiv = document.createElement('div');
    productCountDiv.className = 'productCountDiv';

    const plusButton = document.createElement('button');
    plusButton.className = 'productCountButton plus';
    //const plusIcon = document.createElement('img');
    //plusIcon.className = 'no-select no-drag plusMiniIcon';
    //plusIcon.src = 'icons/PlusMiniIcon.png';
    const plusIcon = document.createElement('span');
    plusIcon.className = 'no-select plusMiniIcon';
    plusIcon.innerHTML = '+';
    plusButton.appendChild(plusIcon);

    const productCount = document.createElement('div');
    productCount.className = 'productCount';
    productCount.textContent = '0';

    const minusButton = document.createElement('button');
    minusButton.className = 'productCountButton minus';
    //const minusIcon = document.createElement('img');
    //minusIcon.className = 'no-select no-drag minusMiniIcon';
    //minusIcon.src = 'icons/MinusMiniIcon.png';
    const minusIcon = document.createElement('span');
    minusIcon.className = 'no-select minusMiniIcon';
    minusIcon.innerHTML = '-';
    minusButton.appendChild(minusIcon);

    productCountDiv.appendChild(minusButton);
    productCountDiv.appendChild(productCount);
    productCountDiv.appendChild(plusButton);

    const productBuyBtn = document.createElement('button');
    productBuyBtn.className = 'productBuyBtn';
    const cartIcon = document.createElement('img');
    cartIcon.className = 'productCartIcon no-select no-drag';
    cartIcon.src = '/icons/Cart.png';
    productBuyBtn.appendChild(cartIcon);

    productControlDiv.appendChild(productCountDiv);
    productControlDiv.appendChild(productBuyBtn);

    productInfoDiv.appendChild(productNameDiv);
    productInfoDiv.appendChild(priceDiv);
    productInfoDiv.appendChild(productControlDiv);

    cardDiv.appendChild(productIconDiv);
    cardDiv.appendChild(productInfoDiv);

    const carouselCardDiv = document.createElement('div');
    if (isFirst) {
        carouselCardDiv.className = 'carousel-item active';
    }
    else {
        carouselCardDiv.className = 'carousel-item';
    }
    carouselCardDiv.appendChild(cardDiv);

    return carouselCardDiv;
}
function cardFunctionality() {
    const cardDivs = document.querySelectorAll('.cardDiv');
    const productCountDivs = document.querySelectorAll('.productCountDiv');
    const productBuyBtns = document.querySelectorAll('.productBuyBtn');

    productBuyBtns.forEach(item => {
        item.addEventListener('click', function (event) {
            const cardDiv = item.closest('.cardDiv');
            const countElement = cardDiv.querySelector('.productCount');
            if (countElement) {
                let currentCount = parseInt(countElement.innerHTML, 10);
                if (currentCount > 0) {
                    var userId = localStorage.getItem("userId");
                    if (userId != 0) {
                        AddProductInCart(cardDiv.id, count.innerHTML, userId);
                        count.innerHTML = '0';
                    }
                    else {
                        document.querySelector(".toast-body").innerHTML = "Спершу потрібно увійти в акаунт ~(`Y_Y`)~";
                        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                        toastBootstrap.show();
                    }
                }
                else {
                    document.querySelector(".toast-body").innerHTML = "Спершу виберіть кількість товар (`U_U`)!";
                    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                    toastBootstrap.show();
                }
            }
        });
    });
    cardDivs.forEach(item => {
        item.addEventListener('click', function (event) {
            const productControlDiv = item.querySelector('.productControlDiv');
            if (productControlDiv && !productControlDiv.contains(event.target)) {
                var productId = item.id;
                window.location = "/Goodmeal/ProductPage/" + productId;
            }
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
    productCountDivs.forEach(item => {
        const minus = item.getElementsByClassName('minus')[0];
        const plus = item.getElementsByClassName('plus')[0];
        const count = item.getElementsByClassName('productCount')[0];
        minus.addEventListener('click', function (event) {
            event.stopPropagation();
            let currentCount = parseInt(count.innerHTML);
            if (currentCount > 0) {
                count.innerHTML = `${currentCount - 1}`;
            }
        });

        plus.addEventListener('click', function (event) {
            event.stopPropagation();
            let currentCount = parseInt(count.innerHTML);
            count.innerHTML = `${currentCount + 1}`;
        });
    });
}

//Photo switch functionality
const buttonPrev = document.getElementById('buttonPrev');
const buttonNext = document.getElementById('buttonNext');
var photoPosition = 1;
var photoCount;

function updateButtons() {
    if (photoCount === 1) {
        buttonPrev.classList.add('noActiveButton');
        buttonNext.classList.add('noActiveButton');
    } else {
        if (photoPosition === 1) {
            buttonPrev.classList.add('noActiveButton');
            buttonNext.classList.remove('noActiveButton');
        } else if (photoPosition === photoCount) {
            buttonPrev.classList.remove('noActiveButton');
            buttonNext.classList.add('noActiveButton');
        } else {
            buttonPrev.classList.remove('noActiveButton');
            buttonNext.classList.remove('noActiveButton');
        }
    }
}
updateButtons();

buttonPrev.addEventListener('click', function () {
    if (photoPosition > 1) {
        const largeContainer = document.querySelector('.large');
        const bigImg = largeContainer.querySelector('img');
        const smallImg = document.getElementById("productSmallImg" + (photoPosition - 1).toString());
        bigImg.src = smallImg.src;

        cleerImgBorder();
        const photoSmallDiv = smallImg.closest('.photo.small');
        photoSmallDiv.classList.add('selected');
        photoPosition--;
        updateButtons();
    }
});

buttonNext.addEventListener('click', function () {
    if (photoPosition < photoCount) {
        const largeContainer = document.querySelector('.large');
        const bigImg = largeContainer.querySelector('img');
        const smallImg = document.getElementById("productSmallImg" + (photoPosition + 1).toString());
        bigImg.src = smallImg.src;

        cleerImgBorder();
        const photoSmallDiv = smallImg.closest('.photo.small');
        photoSmallDiv.classList.add('selected');
        photoPosition++;
        updateButtons();
    }
});

function cleerImgBorder(){
    const photosSmall = document.querySelectorAll('.photo.small');
    photosSmall.forEach(item => {
        if (item.classList.contains('selected'))
            item.classList.remove('selected')
    });
}

//Product switch functionality
function productsSwitch() {
    var carouselInner = document.getElementById('subProductsDiv');
    var cardWidth = document.querySelector('.carousel-item').offsetWidth;
    var scrollItem = cardWidth + 28;
    var scrollPosition = 0;
    var carouselScrollWidth = carouselInner.scrollWidth;
    var carouselWidth = carouselInner.offsetWidth;
    var totalItems = Math.floor(carouselScrollWidth / scrollItem);

    function updateCarousel() {
        cardWidth = document.querySelector('.carousel-item').offsetWidth;
        scrollItem = cardWidth + 28;
        carouselScrollWidth = carouselInner.scrollWidth;
        carouselWidth = carouselInner.offsetWidth;

        scrollPosition = Math.min(scrollPosition, totalItems * scrollItem - carouselWidth);
    }

    window.addEventListener('resize', function () {
        updateCarousel();
    });

    document.querySelector('.carouselControlNext').addEventListener('click', function () {
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

    document.querySelector('.carouselControlPrev').addEventListener('click', function () {
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

//Overlay /////////////////////////////////////////////////////////////////////////////////////////////////////
const overlayRatingPopUp = document.getElementById('ratingOverlay');
overlayRatingPopUp.addEventListener('click', function () {
    closeRatingPopUpEvent();
    clearStars();
});
function closeRatingPopUpEvent() {
    overlayRatingPopUp.style.display = 'none';
    overlayRatingPopUp.style.zIndex = 9990;
    ratingPopUp.style.display = "none";
    document.body.classList.remove('no-scroll');
    clearStars();
}

//Rating popup

const ratingPopUp = document.getElementById('ratingPopUp');
const rating = document.getElementById('rating');

rating.addEventListener('click', function () {
    overlayRatingPopUp.style.display = 'block';
    overlayRatingPopUp.style.zIndex = 9998;
    ratingPopUp.style.display = "flex";

    document.body.classList.add('no-scroll');
    ratingPopUp.focus();
});
document.getElementById('cancelRating').addEventListener('click', function () {
    closeRatingPopUpEvent();
});


//Rating stars
const starsDiv = document.getElementById('ratingStarsDiv');
const mainStarsDiv = document.getElementById('mainRatingStarsDiv');
const stars = document.querySelectorAll('.setRatingStar');
const ratingBtn = document.querySelector('.setRatingBtn');
var selectedRating = 0;

ratingBtn.addEventListener('click', function () {
    var userId = localStorage.getItem("userId")
    if (selectedRating != 0 && localStorage.getItem("userId") != 0)
        SetRating(selectedRating, `${userId}`, productId);
    else {
        document.querySelector(".toast-body").innerHTML = "Спершу потрібно увійти в акаунт ~(`Y_Y`)~";
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    }
    closeRatingPopUpEvent();
});

function highlightStars(starIndex) {
    stars.forEach((star, index) => {
        if (index < starIndex) {
            star.src = "/icons/HoverSetRatingStar.png";
        } else {
            star.src = "/icons/SetRatingStar.png";
        }
    });
}

function selectStars(starIndex) {
    if (!stars[starIndex - 1].classList.contains("selected") || selectedRating != starIndex) {
        selectedRating = starIndex;
        stars.forEach((star, index) => {
            if (index < starIndex) {
                star.classList.add("selected");
            } else {
                star.classList.remove("selected");
            }
        });
    }
    else {
        stars.forEach(star => {
            star.classList.remove("selected");
            selectedRating = 0;
        });
    }
}

function clearStars(){
    stars.forEach(star => {
        star.classList.remove("selected");
        star.src = "/icons/SetRatingStar.png";
        selectedRating = 0;
    }
)};

stars.forEach(star => {
    star.addEventListener('click', function (event) {
        const starId = event.target.id;
        const starIndex = parseInt(starId);
        selectStars(starIndex);
    });
});

starsDiv.addEventListener('mouseover', function (event) {
    if (event.target && event.target.classList.contains('setRatingStar')) {
        const starId = event.target.id;
        const starIndex = parseInt(starId);
        highlightStars(starIndex);
    }
});

mainStarsDiv.addEventListener('mouseleave', function () {
    stars.forEach(star => {
        if (!star.classList.contains("selected"))
            star.src = "/icons/SetRatingStar.png";
        else {
            if (!star.src.includes("Hover"))
                star.src = "/icons/HoverSetRatingStar.png";
        }
    });
});

async function SetRating(rating, comment, productId) {
    try {
        const response = await fetch("http://localhost:5152/gateway/SetRating", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",       
            },
            body: JSON.stringify({
                value: rating,
                comment: comment,
                idProduct: productId,
            })
        });
        if (response.ok) {
            window.location.reload();
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}



//Info arrows
var info = document.querySelector('.info-section-content');
var description = document.querySelector('.description');
function switchAll(index) {
    var accordion = null;
    var image = null;
    switch (index) {
        case 0:
            if (info.classList.contains('active')) {
                accordion = info.closest('.accordion');
                image = accordion.querySelector('.ArrowHorisontalImg');
                info.classList.toggle('active');
                image.classList.toggle('rotated');
            }
            accordion = description.closest('.accordion');
            image = accordion.querySelector('.ArrowHorisontalImg');
            description.classList.toggle('active');
            image.classList.toggle('rotated');
            break;
        case 1:
            if (description.classList.contains('active')) {
                description.classList.toggle('active');
                accordion = description.closest('.accordion');
                image = accordion.querySelector('.ArrowHorisontalImg');
                image.classList.toggle('rotated');
            }
            accordion = info.closest('.accordion');
            image = accordion.querySelector('.ArrowHorisontalImg');
            info.classList.toggle('active');
            image.classList.toggle('rotated');
            break;
        default:
            description.classList.toggle('active');
            info.classList.toggle('active');
    }
}
function toggleDropdownDescription() {
    switchAll(0);
}
function toggleDropdown() {
    switchAll(1);
}

//Main product Functionality
const addToCartBtn = document.getElementById('addToCart');
const minus = document.getElementsByClassName('minusProduct')[0];
const plus = document.getElementsByClassName('plusProduct')[0];
const count = document.getElementsByClassName('quantity')[0];

minus.addEventListener('click', function () {
    let currentCount = parseInt(count.innerHTML);
    if (currentCount > 0) {
        count.innerHTML = `${currentCount - 1}`;
    }
});

plus.addEventListener('click', function () {
    let currentCount = parseInt(count.innerHTML);
    count.innerHTML = `${currentCount + 1}`;
});

addToCartBtn.addEventListener('click', function () {
    const cartControll = addToCartBtn.closest('.cartControllDiv');
    const count = cartControll.querySelector('.quantity');
    if (count) {
        let currentCount = parseInt(count.innerHTML, 10);
        if (currentCount > 0) {
            var userId = localStorage.getItem("userId");
            if (userId != 0) {
                AddProductInCart(addToCartBtn.getAttribute('product-id'), count.innerHTML, userId);
                count.innerHTML = '0';
            }
            else {
                document.querySelector(".toast-body").innerHTML = "Спершу потрібно увійти в акаунт ~(`Y_Y`)~";
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                toastBootstrap.show();
            }
        }
        else {
            document.querySelector(".toast-body").innerHTML = "Спершу виберіть кількість товар (`U_U`)!";
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();

        }
    }
});
