document.addEventListener('DOMContentLoaded', function () {
    const categoryPanels = document.querySelectorAll('.panel');
    const accordionButtons = document.querySelectorAll('.accordionButton');
    const certificateButtons = document.querySelectorAll('#options button');
    const shopDivs = document.querySelectorAll('.shopElement');

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
    categoryPanels.forEach(panel => {
        panel.addEventListener('click', function () {
            var categoryId = 0; //З бази 
            window.location = "/Home/Category/" + categoryId;
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
    certificateButtons.forEach(item => {
        item.addEventListener('click', function () {
            this.classList.toggle('selectedCertificate');
        });
    });

    function createProductCard({
        discountIconSrc = 'icons/Discount.png',
        productIconSrc = 'icons/ProductIcon.png',
        productName = 'Название продукта',
        productFullName = 'Полное название продукта',
        currentPrice = '0 грн',
        oldPrice = '0 грн',
        productId = ''
    }) {
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
        plusIcon.src = 'icons/PlusMiniIcon.png';
        plusButton.appendChild(plusIcon);

        const productCount = document.createElement('div');
        productCount.className = 'productCount';
        productCount.textContent = '0';

        const minusButton = document.createElement('button');
        minusButton.className = 'productCountButton minus';
        const minusIcon = document.createElement('img');
        minusIcon.className = 'no-select no-drag';
        minusIcon.src = 'icons/MinusMiniIcon.png';
        minusButton.appendChild(minusIcon);

        productCountDiv.appendChild(minusButton);
        productCountDiv.appendChild(productCount);
        productCountDiv.appendChild(plusButton);

        const productBuyBtn = document.createElement('button');
        productBuyBtn.className = 'productBuyBtn';
        const cartIcon = document.createElement('img');
        cartIcon.className = 'productCartIcon';
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

    for (var i = 0; i < 18; i++) {
        const productCard = createProductCard({
            discountIconSrc: 'icons/Discount.png',
            productIconSrc: 'icons/ProductIcon.png',
            productName: 'Сьомга Norven',
            productFullName: 'Сьомга Norven слабосолена в/у, 120г',
            currentPrice: '256',
            oldPrice: '315',
            productId: '123'
        });
        document.getElementById('subProductsDiv').appendChild(productCard);
        
    }

    const cardDivs = document.querySelectorAll('.cardDiv');
    const productCountDivs = document.querySelectorAll('.productCountDiv');
    const productBuyBtns = document.querySelectorAll('.productBuyBtn');
    const certificateBuy = document.querySelectorAll('.addToCart');

    cardDivs.forEach(item => {
        item.addEventListener('click', function (event) {
            const productControlDiv = item.querySelector('.productControlDiv');
            if (productControlDiv && !productControlDiv.contains(event.target)) {
                var productId = 0; //З базы 
                window.location = "/Product/ProductPage/" + productId;
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

    productBuyBtns.forEach(item => {
        item.addEventListener('click', function (event) {
            event.stopPropagation();
            const cardDiv = item.closest('.cardDiv');
            const count = cardDiv.querySelector('.productCount');
            if (count) {
                let currentCount = parseInt(count.innerHTML);
                if (currentCount > 0) {
                    if (currentCount > 0) {
                        count.innerHTML = '0';
                    }
                    alert("Товар додано в кошик!");
                }
                else {
                    alert("Спершу виберіть кількість товар (`U_U`)!");
                }
            }
        });
    });

    certificateBuy.forEach(item => {
        item.addEventListener('click', function (event) {
            //event.stopPropagation();
            //const cardDiv = item.closest('.cardDiv');
            //const count = cardDiv.querySelector('.productCount');
            //if (count) {
            //    let currentCount = parseInt(count.innerHTML);
            //    if (currentCount > 0) {
            //        count.innerHTML = '0';
            //    }
            //}
            alert("Товар додано в кошик!");
        });
    });
});