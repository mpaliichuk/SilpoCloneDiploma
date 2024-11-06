var categoryName = document.getElementById("subCategoryName").value;
if (categoryName != "All") {
    document.getElementById("categoryNameDiv").innerText = categoryName;
}

var currentPage = 1;
var pageSize = 18;
var newPage = true;
var pageChangeSymbol = "plus";

GetProducts();
async function GetCategoryInfo(categoryId) {
    try {
        const response = await fetch("http://localhost:5152/gateway/CategoryById/" + categoryId, {
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
            alert("Товар додано в кошик!");
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
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
    if (newPage)
        document.getElementById('subProductsDiv').innerText = '';
    for (var i = 0; i < 18; i++) {
        const productCard = createProductCard({
            productIconSrc: '/icons/ProductIcon.png',
            productName: 'Сьомга Norven',
            productFullName: 'Сьомга Norven слабосолена в/у, 120г',
            currentPrice: '256',
            oldPrice: '315',
            productId: '123'
        });
        document.getElementById('subProductsDiv').appendChild(productCard);
    }
    addCardsEvents();
}
function createProductCard({ productIconSrc, productName, productFullName,
    currentPrice, oldPrice, productId, discountIconSrc = '/icons/Discount.png' }) {
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

    return cardDiv;
}

const moreItemsBtn = document.getElementById('moreItems');
var pageButtons = document.querySelectorAll('.pageButton');
const buttonPrev = document.getElementById('buttonPrev');
const buttonNext = document.getElementById('buttonNext');

moreItemsBtn.addEventListener("click", function () {
    newPage = false;
    GetProducts();
    pageChangeSymbol = "plus";
    changePageText(pageChangeSymbol);
});

buttonNext.addEventListener("click", function () {
    newPage = true;
    GetProducts();
    pageChangeSymbol = "plus";
    changePageText(pageChangeSymbol);
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
});

buttonPrev.addEventListener("click", function () {
    newPage = true;
    GetProducts();
    pageChangeSymbol = "minus";
    changePageText(pageChangeSymbol);
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
});

function changePageText(pageChangeSymbol) {
    var tmpPage = currentPage;
    var minusStep = 0;
    pageButtons.forEach(btn => {
        if (pageChangeSymbol == "plus")
            btn.innerText = ++tmpPage;
        else {
            tmpPage--;
            btn.innerText = tmpPage - minusStep;
            minusStep++;
            tmpPage += 3;
        }
    });
    if (pageChangeSymbol == "plus")
        currentPage++;
    else
        currentPage--;
}

/*////////////////////////////      Cards       //////////////////////////////////////////////*/
function addCardsEvents() {
    const cardDivs = document.querySelectorAll('.cardDiv');
    const productCountDivs = document.querySelectorAll('.productCountDiv');
    const productBuyBtns = document.querySelectorAll('.productBuyBtn');

    productBuyBtns.forEach(item => {
        item.addEventListener('click', function (event) {
            event.stopPropagation();
            const cardDiv = item.closest('.cardDiv');
            const count = cardDiv.querySelector('.productCount');
            if (count) {
                let currentCount = parseInt(count.innerHTML);
                if (currentCount > 0) {
                    AddProductInCart(cardDiv.id, count.innerHTML, /*userId*/ 1);
                    count.innerHTML = '0';
                }
                else {
                    alert("Спершу виберіть кількість товар (`U_U`)!");
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

        const cartButton = item.querySelector('.productBuyBtn');
        cartButton.addEventListener('mouseenter', function (event) {
            event.stopPropagation();
        });

        cartButton.addEventListener('mouseleave', function (event) {
            event.stopPropagation();
        });
    })

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

/*////////////////////////////////  Filter  //////////////////////////////////////////////////*/

const filterPopUp = document.getElementById('filterPopUp');
const filterButton = document.getElementById('filterButton');
const overlayFilterPopUp = document.getElementById('filterOverlay');

function closeRatingPopUpEvent() {
    overlayFilterPopUp.style.display = 'none';
    overlayFilterPopUp.style.zIndex = 9990;
    filterPopUp.style.display = "none";
    document.body.classList.remove('no-scroll');
}

filterButton.addEventListener('click', function () {
    filterPopUp.style.display = "flex";
    setTimeout(() => {
        filterPopUp.classList.add('showFilter'); 
    }, 10);
    overlayFilterPopUp.style.zIndex = 9998;
    overlayFilterPopUp.style.display = 'block';
    document.body.classList.add('no-scroll');
    filterPopUp.focus();
});

overlayFilterPopUp.addEventListener('click', function () {
    closeRatingPopUpEvent();
});

document.getElementById('cancelFilter').addEventListener('click', function () {
    closeRatingPopUpEvent();
});

//Info arrows
var info = document.querySelectorAll('.info-section-content');

function toggleDropdown(idFilter) {
    info.forEach(item => {
        filter = item.closest('.filter');
        image = filter.querySelector('.ArrowHorisontalImg');
        if (item.id == idFilter) {
            item.classList.toggle('active');
            image.classList.toggle('rotated');
        }
        else {
            if (image.classList.contains('rotated')) {
                item.classList.toggle('active');
                image.classList.toggle('rotated');
            }
        }
    });
    //switch (index) {
    //    case 0:
    //        if (info.classList.contains('active')) {
    //            accordion = info.closest('.accordion');
    //            image = accordion.querySelector('.ArrowHorisontalImg');
    //            info.classList.toggle('active');
    //            image.classList.toggle('rotated');
    //        }
    //        image = accordion.querySelector('.ArrowHorisontalImg');
    //        image.classList.toggle('rotated');
    //        break;
    //    case 1:
            
    //        break;
    //    default:
    //        info.classList.toggle('active');
    //}
}