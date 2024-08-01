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
        // Создание главного контейнера карточки
        const cardDiv = document.createElement('div');
        cardDiv.id = `cardDiv_${productId}`;
        cardDiv.className = 'cardDiv';

        // Создание контейнера для иконок
        const productIconDiv = document.createElement('div');
        productIconDiv.className = 'productIconDiv';

        // Создание иконки скидки
        const discountIcon = document.createElement('img');
        discountIcon.className = 'discountIcon';
        discountIcon.src = discountIconSrc;

        // Создание иконки продукта
        const productIcon = document.createElement('img');
        productIcon.className = 'productIcon';
        productIcon.src = productIconSrc;

        // Добавление иконок в контейнер
        productIconDiv.appendChild(discountIcon);
        productIconDiv.appendChild(productIcon);

        // Создание контейнера для информации о продукте
        const productInfoDiv = document.createElement('div');
        productInfoDiv.className = 'productInfoDiv';

        // Создание блока с названием продукта
        const productNameDiv = document.createElement('div');
        productNameDiv.className = 'productNameDiv';

        const productNameElement = document.createElement('div');
        productNameElement.className = 'productName';
        productNameElement.textContent = productName;

        const productFullNameElement = document.createElement('div');
        productFullNameElement.className = 'productFullName';
        productFullNameElement.textContent = productFullName;

        productNameDiv.appendChild(productNameElement);
        productNameDiv.appendChild(productFullNameElement);

        // Создание блока с ценой
        const priceDiv = document.createElement('div');
        priceDiv.className = 'priceDiv';

        const subPriceDiv = document.createElement('div');
        subPriceDiv.className = 'subPriceDiv';
        subPriceDiv.innerHTML = `<b>${currentPrice}</b><span>грн</span>`;

        const crossTextDiv = document.createElement('div');
        crossTextDiv.className = 'crossTextDiv';
        crossTextDiv.innerHTML = `<span>${oldPrice} грн</span>`;

        priceDiv.appendChild(subPriceDiv);
        priceDiv.appendChild(crossTextDiv);

        // Создание блока управления продуктом
        const productControlDiv = document.createElement('div');
        productControlDiv.className = 'productControlDiv';

        const productCountDiv = document.createElement('div');
        productCountDiv.className = 'productCountDiv';

        const plusButton = document.createElement('button');
        plusButton.className = 'productCountButton';
        const plusIcon = document.createElement('img');
        plusIcon.className = 'no-select no-drag';
        plusIcon.src = 'icons/PlusMiniIcon.png';
        plusButton.appendChild(plusIcon);

        const productCount = document.createElement('div');
        productCount.className = 'productCount';
        productCount.textContent = '0';

        const minusButton = document.createElement('button');
        minusButton.className = 'productCountButton';
        const minusIcon = document.createElement('img');
        minusIcon.className = 'no-select no-drag';
        minusIcon.src = 'icons/MinusMiniIcon.png';
        minusButton.appendChild(minusIcon);

        productCountDiv.appendChild(minusButton);
        productCountDiv.appendChild(productCount);
        productCountDiv.appendChild(plusButton);

        // Создание кнопки покупки продукта
        const productBuyDiv = document.createElement('button');
        productBuyDiv.className = 'productBuyDiv';
        const cartIcon = document.createElement('img');
        cartIcon.className = 'productCartIcon';
        cartIcon.src = 'icons/Cart.png';
        productBuyDiv.appendChild(cartIcon);

        productControlDiv.appendChild(productCountDiv);
        productControlDiv.appendChild(productBuyDiv);

        // Добавление всех частей в главный контейнер
        productInfoDiv.appendChild(productNameDiv);
        productInfoDiv.appendChild(priceDiv);
        productInfoDiv.appendChild(productControlDiv);

        cardDiv.appendChild(productIconDiv);
        cardDiv.appendChild(productInfoDiv);

        // Возвращаем готовый элемент карточки
        return cardDiv;
    }

    for (var i = 0; i < 15; i++) {
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

});