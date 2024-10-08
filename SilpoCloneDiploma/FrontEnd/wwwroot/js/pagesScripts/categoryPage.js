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
    var isFirstBool = false;
    for (var i = 0; i < 18; i++) {
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