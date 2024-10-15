//Шляхи для оцелота: /api/Products/ProductsByDiscount, /api/Products, /api/Cart/AddCertificates

/////////////////////           PageSettings             ///////////////////

var userStorage = JSON.parse(localStorage.getItem("certificates"));
var initialCartString = JSON.stringify({});

/////////////////////////////////////////////////////////////////////////////

if (!Array.isArray(userStorage)) {
    userStorage = [];
}
localStorage.setItem("certificates", initialCartString); 

/////////////////////           ProgramStart             ///////////////////

GetProducts();

/////////////////////              DB_WORK              ////////////////////

async function GetProducts() {
    var productsByDiscount = [];

    try {
        const response = await fetch("http://localhost:5152/gateway/DiscountedProducts", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        if (response.ok) {
            productsByDiscount = await response.json();
            //productsByDiscount.forEach(product => {
            //    const productCard = createProductCard(product);
            //    document.getElementById('subProductsDiv').appendChild(productCard);
            //});
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
    console.log(productsByDiscount);
    for (var i = 0; i < productsByDiscount.length; i++) {
        const productCard = createProductCard({
            productIconSrc: productsByDiscount[i].imageUrls[0],
            productName: productsByDiscount[i].title,
            productFullName: productsByDiscount[i].productComposition,
            price: productsByDiscount[i].price,
            sale: productsByDiscount[i].sale,
            productId: productsByDiscount[i].id
        });
        document.getElementById('subProductsDiv').appendChild(productCard);
    }
    cardFunctionality();
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
async function addCertificatesToCart(certificates) {
    try {
        const response = await fetch('/api/Cart/AddCertificates', {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(certificates)
        });
        if (response.ok) {
            alert("Сертифікати додано в кошик!");
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function createProductCard({ productIconSrc, productName, productFullName,
    price, sale, productId, discountIconSrc = 'icons/Discount.png' })
{
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
    const discountedPrice = price - (price * (sale / 100));
    subPriceDiv.innerHTML = `<b>${discountedPrice % 1 === 0 ? discountedPrice.toFixed(0) : discountedPrice.toFixed(2)}</b><span>грн</span>`;

    const crossTextDiv = document.createElement('div');
    crossTextDiv.className = 'crossTextDiv';
    crossTextDiv.innerHTML = `<span>${price} грн</span>`;

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
    cartIcon.src = 'icons/Cart.png';
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

/////////////////////              CONTROLS              ////////////////////

const categoryPanels = document.querySelectorAll('.panel');
const accordionButtons = document.querySelectorAll('.accordionButton');
const certificateButtons = document.querySelectorAll('.certificate');
const shopDivs = document.querySelectorAll('.shopElement');
const certificateBuy = document.querySelectorAll('.addToCart');

categoryPanels.forEach(panel => {
    panel.addEventListener('click', function (event) {
        var categoryName = event.currentTarget.id;
        window.location = "/Goodmeal/Category/" + categoryName;
    });

    panel.addEventListener('mouseenter', function () {
        const img = panel.querySelector('img');
        if (img) {
            if (!img.dataset.originalSrc) {
                img.dataset.originalSrc = img.src;
            }
            img.src = img.src.replace(/icons\//, 'icons/Hover');
        }
    });

    panel.addEventListener('mouseleave', function () {
        const img = panel.querySelector('img');
        if (img && img.dataset.originalSrc) {
            img.src = img.dataset.originalSrc;
        }
    });
});

function cardFunctionality() {
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

certificateButtons.forEach(certificate => {
    certificate.addEventListener('click', function (event) {
        event.target.classList.toggle('selectedCertificate');
        var items = JSON.parse(localStorage.getItem('certificates'));
        if (event.target.classList.contains('selectedCertificate')){
            if (!Array.isArray(items)) {
                items = [];
            }
            /*items.push({ productId: productId, productCount: 1, userId: userId });*/
            items.push({ productId: event.target.id, productCount: 1, userId: 0 });
            localStorage.setItem('certificates', JSON.stringify(items));
            alert('Сертифікат на суму ' + event.target.id + 'грн було збережено (´ ω `♡)');
        }
        else {
            items = items.filter(element => element.productId !== event.target.id);
            localStorage.setItem('certificates', JSON.stringify(items));
            alert('Сертифікат на суму ' + event.target.id + 'грн було видалено зі збережених (>_<)');
        }
    });
});

certificateBuy.forEach(item => {
    item.addEventListener('click', async function (event) {
        let certificates = JSON.parse(localStorage.getItem('certificates')) || [];
        let message = '';
        if (certificates.length > 0) {
            certificates.forEach(certificate => {
                message += `Сертифікат на суму ${certificate.productId} грн ${certificate.userId} було додано в кошик (*^ω^) \n`;
            });
            if (message) {
                alert(message);
            }

            //addCertificatesToCart(certificates);
            await certificateButtons.forEach(certificateButton => {
                certificateButton.classList.remove('selectedCertificate');
            });
            certificates = [];
            localStorage.setItem('certificates', JSON.stringify(certificates));
        }
        else {
            alert("Спершу виберіть сертифікати для покупки (*μ_μ)!");
        }
    });
});

accordionButtons.forEach(item => {
    const img = item.querySelector('img');
    item.addEventListener('click', function () {
        var parentDiv = this.parentElement;
        parentDiv.classList.toggle('active');
        var text = parentDiv.nextElementSibling;
        if (text.style.maxHeight) {
            text.style.maxHeight = null;
            img.src = '/icons/Plus.png';
        } else {
            text.style.maxHeight = text.scrollHeight + "px";
            img.src = '/icons/Minus.png';
        }

    });
    item.addEventListener('mouseenter', function () {
        if (!img.dataset.originalSrc) {
            img.dataset.originalSrc = img.src;
        }
        img.src = img.src.replace(/icons\//, 'icons/Hover');
    });
    item.addEventListener('mouseleave', function () {
        var parentDiv = this.parentElement;
        if (parentDiv.classList.contains('active')) {
            img.src = '/icons/Minus.png';
        } else {
            img.src = img.dataset.originalSrc;
        }
    });
});

shopDivs.forEach(item => {
    const img = item.querySelector('img');
    item.addEventListener('mouseenter', function () {
        if (!img.dataset.originalSrc) {
            img.dataset.originalSrc = img.src;
        }
        img.src = img.src.replace(/icons\//, 'icons/Hover');
    });
    item.addEventListener('mouseleave', function () {
        img.src = '/icons/CarrotPointer.png';
    });
});

/////////////////////////////////////////////////////////////////////////////
