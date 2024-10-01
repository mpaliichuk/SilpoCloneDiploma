var productId = document.getElementById("productId").value;
GetProduct(productId);

GetProducts();
async function GetProduct(productId) {
    // const response = await fetch("/api/Products/" + productId, {
    //     method: "GET",
    //     headers: {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json"
    //     }
    // });
    // if (response.ok) {
    //     const product = await response.json();
        let product = {
            id: 5,
            title: "Умные часы XYZ",
            description: "Многофункциональные умные часы с сенсорным экраном и мониторингом здоровья.",
            imageUrls: [
                "https://i.pinimg.com/736x/1e/f2/9b/1ef29ba4eee6204bf2fe891456d10970.jpg",
                "https://i.pinimg.com/564x/d2/b3/43/d2b3433dd73e81ec561b2a43587b60fe.jpg",
                "https://i.pinimg.com/736x/a9/f7/0c/a9f70cff8206e7bf189f2e14cc9a915c.jpg",
                "https://i.pinimg.com/736x/33/54/cf/3354cf583d7fa7a30e3300de83e4bf44.jpg"
            ],
            price: 5000,
            discountPercentage: 10,
            rating: 4.5,
            category_id: 3,
            attributes: [
                { key: "Цвет", value: "Чёрный" },
                { key: "Материал", value: "Металл и пластик" },
                { key: "Время работы", value: "48 часов" },
                { key: "Вес", value: "50 грамм" }
            ]
        };

        document.getElementById("productRouteName").innerText = product.title;
        document.getElementById("productTitle").innerText = product.title;
        document.getElementById("descriptionInfo").innerText = product.description;
        document.getElementById("productMainImg").src = product.imageUrls[0];

        for (let i = 1; i < product.imageUrls.length; i++) {
            let smallImg = document.getElementById("productSmallImg" + i.toString());
            if (smallImg) {
                smallImg.src = product.imageUrls[i];
            }
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

        let finalPrice = product.price - (product.price * (product.discountPercentage / 100));
        document.getElementById("productPrice").innerText = finalPrice.toFixed(2) + " грн";

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
        //GetCategory(product.category_id);
    // }
}
async function GetProducts() {
    var productsByDiscount = [];

    /*try {
        const response = await fetch("/api/Products/ProductsByDiscount", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        if (response.ok) {
            const productsByDiscount = await response.json();
            productsByDiscount.forEach(product => {
                const productCard = createProductCard(product);
                document.getElementById('subProductsDiv').appendChild(productCard);
            });
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }*/
    var isFirstBool = false;
    for (var i = 0; i < 12; i++) {
        if (i == 0) {
            isFirstBool = true;
        }
        const productCard = createProductCard({
            productIconSrc: '/icons/ProductIcon.png',
            productName: 'Сьомга Norven',
            productFullName: 'Сьомга Norven слабосолена в/у, 120г',
            currentPrice: '256',
            oldPrice: '315',
            productId: '123',
            isFirst: isFirstBool
        });
        document.getElementById('subProductsDiv').appendChild(productCard);
        isFirstBool = false;
    }
}

//Controls

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

async function AddProductInCart(productId, productCount, userId) {
    try {
        const response = await fetch("/api/Products", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: productId,
                productCount: productCount,
                userId: userId
            })
        });
        if (response.ok) {
            alert("Товар додано в кошик!");
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function createProductCard({ productIconSrc, productName, productFullName,
    currentPrice, oldPrice, productId, isFirst, discountIconSrc = '/icons/Discount.png' }) {
    const cardDiv = document.createElement('div');
    cardDiv.id = `${productId}`;
    cardDiv.className = 'cardDiv';
    //cardDiv.setAttribute("product-id", productId);

    const productIconDiv = document.createElement('div');
    productIconDiv.className = 'productIconDiv no-select';

    const discountIcon = document.createElement('img');
    discountIcon.className = 'discountIcon no-select no-drag';
    discountIcon.src = discountIconSrc;

    const productIcon = document.createElement('img');
    productIcon.className = 'productIcon';
    productIcon.src = productIconSrc;

    productIconDiv.appendChild(discountIcon);
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

    const subPriceDiv = document.createElement('div');
    subPriceDiv.className = 'subPriceDiv';
    subPriceDiv.innerHTML = `<b>${currentPrice}</b><span>грн</span>`;

    const crossTextDiv = document.createElement('div');
    crossTextDiv.className = 'crossTextDiv';
    crossTextDiv.innerHTML = `<span>${oldPrice} грн</span>`;

    priceDiv.appendChild(subPriceDiv);
    priceDiv.appendChild(crossTextDiv);

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


const cardDivs = document.querySelectorAll('.cardDiv');
const productCountDivs = document.querySelectorAll('.productCountDiv');
const productBuyBtns = document.querySelectorAll('.productBuyBtn');
const addToCartBtn = document.getElementById('addToCart');
const photos = document.querySelectorAll('.poductPhoto');

photos.forEach(item => {
    item.addEventListener('click', function (event) {
        if (!event.target.classList.contains('largePhoto')) {
            const largeContainer = document.querySelector('.large');
            const bigImg = largeContainer.querySelector('img');
            if (bigImg) {
                var tmpSrc = bigImg.src;
                bigImg.src = event.target.src;
                event.target.src = tmpSrc;
            }
        }
    });
});


productBuyBtns.forEach(item => {
    item.addEventListener('click', function (event) {
        const cardDiv = item.closest('.cardDiv');
        const countElement = cardDiv.querySelector('.productCount');
        if (countElement) {
            let currentCount = parseInt(countElement.innerHTML, 10);
            if (currentCount > 0) {
                // AddProductInCart(cardDiv.id, currentCount, /*userId*/ 0);
                alert(`${cardDiv.id}, ${currentCount}, ${0}`);
                countElement.innerHTML = '0';
            } else {
                alert("Спершу виберіть кількість товару (`U_U`)!");
            }
        }
    });
});

cardDivs.forEach(item => {
    item.addEventListener('click', function (event) {
        const productControlDiv = item.querySelector('.productControlDiv');
        if (productControlDiv && !productControlDiv.contains(event.target)) {
            var productId = 0; //З базы 
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

const multipleItemCarousel = document.querySelector('#productsCarousel');
if (window.innerWidth >= 576) {
    var carouselInner = document.querySelector('.carousel-inner');
    var carouselWidth = carouselInner.scrollWidth;
    var cardWidth = document.querySelector('.carousel-item').offsetWidth;

    var scrollPosition = 0;

    document.querySelector('.carouselControlNext').addEventListener('click', function () {
        if (scrollPosition < (carouselWidth - (cardWidth * 6))) {
            scrollPosition += (carouselWidth * 0.065) + (cardWidth * 6) + 18;
            carouselInner.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    });

    document.querySelector('.carouselControlPrev').addEventListener('click', function () {
        if (scrollPosition > 0) {
            scrollPosition -= (carouselWidth * 0.065) + (cardWidth * 6) + 18;
            carouselInner.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    });
} else {
    multipleItemCarousel.classList.add('slide');
}

window.addEventListener('resize', function () {
    if (window.innerWidth >= 576) {
        multipleItemCarousel.classList.remove('slide');
    } else {
        multipleItemCarousel.classList.add('slide');
    }
});

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
            //AddProductInCart(addToCartBtn.getAttribute('product-id'), count.innerHTML, /*userId*/ 0);
            alert(`${addToCartBtn.getAttribute('product-id')}, ${count.innerHTML}, ${0}`);
            count.innerHTML = '0';
        }
        else {
            alert("Спершу виберіть кількість товар (`U_U`)!");
        }
    }
});

addToCartBtn.addEventListener('mouseenter', function () {
    addToCartBtn.style.background = '#FF5722';
});

addToCartBtn.addEventListener('mouseleave', function () {
    addToCartBtn.style.background = '#4CAF50';
});
