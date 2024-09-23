GetProducts();
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

    for (var i = 0; i < 6; i++) {
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
    currentPrice, oldPrice, productId, discountIconSrc = '/icons/Discount.png' }) {
    const cardDiv = document.createElement('div');
    cardDiv.id = `${productId}`;
    cardDiv.className = 'cardDiv';
    //cardDiv.setAttribute("product-id", productId);

    const productIconDiv = document.createElement('div');
    productIconDiv.className = 'productIconDiv no-select';

    const discountIcon = document.createElement('img');
    discountIcon.className = 'discountIcon';
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
    const plusIcon = document.createElement('img');
    plusIcon.className = 'no-select no-drag';
    plusIcon.src = '/icons/PlusMiniIcon.png';
    plusButton.appendChild(plusIcon);

    const productCount = document.createElement('div');
    productCount.className = 'productCount';
    productCount.textContent = '0';

    const minusButton = document.createElement('button');
    minusButton.className = 'productCountButton minus';
    const minusIcon = document.createElement('img');
    minusIcon.className = 'no-select no-drag';
    minusIcon.src = '/icons/MinusMiniIcon.png';
    minusButton.appendChild(minusIcon);

    productCountDiv.appendChild(minusButton);
    productCountDiv.appendChild(productCount);
    productCountDiv.appendChild(plusButton);

    const productBuyBtn = document.createElement('button');
    productBuyBtn.className = 'productBuyBtn';
    const cartIcon = document.createElement('img');
    cartIcon.className = 'productCartIcon';
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
                //AddProductInCart(cardDiv.id, count.innerHTML, /*userId*/ 0);
                alert(`${cardDiv.id}, ${count.innerHTML}, ${0}`);
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

function toggleDropdown() {
    var content = document.querySelector('.info-section-content');
    var description = document.querySelector('.description');

    content.classList.toggle('active');
    description.classList.toggle('description-hidden');
}