﻿var currentPage = 1;
var selectedPage = 1;
var getsOnPage = 0;
var totalPageCount = 0;
var outOfRange = false;
var sortName = "none";
var pageSize = 6;
var newPage = true;
var pageChangeSymbol = "plus";
var selectedFiltersCount = 0;
var selectedFiltersArray= {
    CountryOfManufacture: [],
    TradeMarks: [],
    MinPrice: 0,
    MaxPrice: 0,
};
var systemFiltersArray = {
    CountryOfManufacture: [],
    TradeMarks: []
};

var categoryId = document.getElementById("categoryId").value;
var sortModeElement = document.getElementById("sortMode");

GetCategoryInfo(categoryId);
GetProducts(categoryId, true);
GetFilters();

async function GetCategoryInfo(id) {
    try {
        const response = await fetch("http://localhost:5152/gateway/Category/" + id, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const categoryInfo = await response.json();
            document.getElementById("categoryNameDiv").innerHTML = categoryInfo.name;

            var mainCategory = document.getElementById("productMainCategory");
            var subcategory = document.getElementById("productSubCategory");

            if (categoryInfo.parentCategoryId != null) {
                mainCategory.innerText = categoryInfo.parentCategoryName;
                mainCategory.style.display = "flex";
                mainCategory.href = "/Goodmeal/Category/" + categoryInfo.parentCategoryId;
                subcategory.innerText = categoryInfo.name;
                subcategory.style.display = "flex";
                subcategory.href = "/Goodmeal/Category/" + categoryInfo.id;
                document.getElementById("productSubCategoryArrow").style.display = "flex";
            }
            else {
                mainCategory.innerText = categoryInfo.name;
                mainCategory.style.display = "flex";
                mainCategory.href = "/Goodmeal/Category/" + categoryInfo.id;
            }
            CategoryByParentId(categoryInfo.id.toString());
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
async function CategoryByParentId(parentId) {
    try {
        const response = await fetch("http://localhost:5152/gateway/CategoryByParentId/" + parentId, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const getCategories = await response.json();
            if (getCategories.length > 0)
                generateSubCategoryMarkup(getCategories);
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
async function GetProducts(categoryId, firstIn = null) {
    const urlParams = new URLSearchParams(window.location.search);

    const countries = urlParams.get('countries') ? urlParams.get('countries').split(',') : [];
    const trademarks = urlParams.get('trademarks') ? urlParams.get('trademarks').split(',') : [];
    const minPrice = urlParams.get('minPrice') ? parseFloat(urlParams.get('minPrice')) : null;
    const maxPrice = urlParams.get('maxPrice') ? parseFloat(urlParams.get('maxPrice')) : null;
    const sort = urlParams.get('sort') || (sortModeElement ? sortModeElement.value : '') || sortName;

    const filter = {
        Countries: countries.length > 0 ? countries : [],
        Brands: trademarks.length > 0 ? trademarks : [],
        MinPrice: minPrice !== null ? minPrice : null,
        MaxPrice: maxPrice !== null ? maxPrice : null
    };

    let url = `http://localhost:5152/gateway/GetSortedFilteredPage/${currentPage + getsOnPage}/${pageSize}/${categoryId}/${sort}`;
    var productsOnPage = [];
    try {
        if (filter.Countries.length < 1 && filter.Brands.length < 1 && filter.MinPrice == null && filter.maxPrice == null) {
            const response = await fetch("http://localhost:5152/gateway/GetSortedPage/" + (currentPage + getsOnPage) + "/" + pageSize + "/" + categoryId + "/" + sort, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {
                productsOnPage = await response.json();
                if (firstIn) setPageSize(productsOnPage.totalCount);
            }   
        } else {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filter)
            });

            if (response.ok) {
                productsOnPage = await response.json();
                if (firstIn) setPageSize(productsOnPage.totalCount);
            } 

            if (sort) {
                var sortMode = sort;
                sortName = sortMode;
                var sortModesMapping = {
                    popular: "Спочатку популярні",
                    promotions: "Спочатку акційні",
                    rating: "За рейтингом",
                    alphabetically: "Від А до Я",
                    reverseAlphabetically: "Від Я до А",
                    cheap: "Спочатку дешевші",
                    expensive: "Спочатку дорожчі"
                };

                var sortText = sortModesMapping[sortName] || "Сортувати";
                document.getElementById("sortText").innerHTML = sortText;
            }
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
    if (newPage) {
        document.getElementById('subProductsDiv').innerText = '';
    }
    const productsCount = productsOnPage.products.length;
    const iterations = Math.min(pageSize, productsCount);
    for (var i = 0; i < iterations; i++) {
        const productCard = createProductCard({
            productIconSrc: productsOnPage.products[i].imageUrls[0],
            productName: productsOnPage.products[i].title,
            productFullName: productsOnPage.products[i].productComposition,
            price: productsOnPage.products[i].price,
            sale: productsOnPage.products[i].discount,
            productId: productsOnPage.products[i].id
        });
        document.getElementById('subProductsDiv').appendChild(productCard);
    }
    addCardsEvents();
}
async function GetFilters() {
    try {
        const response = await fetch("http://localhost:5152/gateway/GetFilters/" + categoryId, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();

            const countries = data.reduce((acc, item) => {
                const country = acc.find(c => c.name === item.country);
                if (country) {
                    country.count += item.count;
                } else {
                    acc.push({ name: item.country, count: item.count });
                }
                return acc;
            }, []);

            const tradeMarks = data.reduce((acc, item) => {
                const tradeMark = acc.find(t => t.name === item.tradeMark);
                if (tradeMark) {
                    tradeMark.count += item.count;
                } else {
                    acc.push({ name: item.tradeMark, count: item.count });
                }
                return acc;
            }, []);
            systemFiltersArray.CountryOfManufacture = countries;
            systemFiltersArray.TradeMarks = tradeMarks;
            generateFilterMarkup(systemFiltersArray.CountryOfManufacture, "country");
            generateFilterMarkup(systemFiltersArray.TradeMarks, "tradeMark");
            FilterParams();
        } else {
            console.error(`Failed to fetch filters: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function generateFilterMarkup(data, containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = "";

    data.forEach(item => {
        const label = document.createElement("label");
        label.className = "checkboxContainer";

        const filterName = document.createElement("span");
        filterName.className = "filterName";
        filterName.textContent = item.name;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const checkmark = document.createElement("span");
        checkmark.className = "checkmark";

        const filterCount = document.createElement("span");
        filterCount.className = "filterCount";
        filterCount.textContent = item.count;

        label.appendChild(filterName);
        label.appendChild(checkbox);
        label.appendChild(checkmark);
        label.appendChild(filterCount);

        container.appendChild(label);
    });
}
function createProductCard({ productIconSrc, productName, productFullName,
    price, sale, productId, discountIconSrc = '/icons/Discount.png' }) {
    const cardDiv = document.createElement('div');
    cardDiv.id = `${productId}`;
    cardDiv.className = 'cardDiv';
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

    return cardDiv;
}
function generateSubCategoryMarkup(subCategories) {
    const container = document.createElement("div");
    container.className = "controlSubCategoriesDis";

    subCategories.forEach(subCategory => {
        const a = document.createElement("a");
        a.className = "subCategory";
        a.href = "/Goodmeal/Category/" + subCategory.id;

        const nameSpan = document.createElement("span");
        nameSpan.id = "subCategoryNameText";
        nameSpan.textContent = subCategory.name;

        const countSpan = document.createElement("span");
        countSpan.id = "subCategoryCount";
        countSpan.textContent = subCategory.count;

        a.appendChild(nameSpan);
        a.appendChild(countSpan);
        container.appendChild(a);
    });

    document.querySelector(".controlItemsDis").appendChild(container);
}

///Sort////

var sortsBtns = document.querySelectorAll(".sortName");

if (sortModeElement) {
    var sortMode = sortModeElement.value;
    sortName = sortMode;
    var sortModesMapping = {
        popular: "Спочатку популярні",
        promotions: "Спочатку акційні",
        rating: "За рейтингом",
        alphabetically: "Від А до Я",
        reverseAlphabetically: "Від Я до А",
        cheap: "Спочатку дешевші",
        expensive: "Спочатку дорожчі"
    };

    var sortText = sortModesMapping[sortName] || "Сортувати";
    document.getElementById("sortText").innerHTML = sortText;
}

sortsBtns.forEach(item => {
    item.addEventListener("click", function (event) {
        const sortName = event.target.id;
        const currentUrl = new URL(window.location.href);
        const currentPath = window.location.pathname;
        const searchParams = currentUrl.searchParams;

        if (searchParams.has("sort")) {
            searchParams.set("sort", sortName);
            const newUrl = `${currentPath}?${searchParams.toString()}`;
            window.location = newUrl;
        } else {
            const newPath = `/Goodmeal/Category/${categoryId}/${sortName}`;
            window.location = newPath;
        }
    });
});


///Pages///
const moreItemsBtn = document.getElementById('moreItems');
const buttonPrev = document.getElementById('buttonPrev');
const buttonNext = document.getElementById('buttonNext');

moreItemsBtn.addEventListener("click", function () {
    newPage = false;
    pageChangeSymbol = "plus";
    changePageText(pageChangeSymbol);
    if (!outOfRange)
        GetProducts(categoryId);
});

buttonNext.addEventListener("click", function () {
    newPage = true;
    pageChangeSymbol = "plus";
    changePageText(pageChangeSymbol);
    if (!outOfRange) {
        window.scrollTo({
            top: 200,
            left: 0,
            behavior: 'smooth'
        });
        GetProducts(categoryId);
    }
});

buttonPrev.addEventListener("click", function () {
    newPage = true;
    pageChangeSymbol = "minus";
    changePageText(pageChangeSymbol);
    if (!outOfRange) {
        window.scrollTo({
            top: 200,
            left: 0,
            behavior: 'smooth'
        });
        GetProducts(categoryId);
    }
});

function selectPageFunctionalyty() {
    const pageButtons = document.querySelectorAll('.pageButton');
    pageButtons.forEach(item => {
        item.addEventListener("click", function (event) {
            newPage = true;
            pageChangeSymbol = "select";
            selectedPage = parseInt(event.target.innerHTML);
            if (selectedPage != currentPage) {
                changePageText(pageChangeSymbol);
                if (!outOfRange) {
                    window.scrollTo({
                        top: 200,
                        left: 0,
                        behavior: 'smooth'
                    });
                    GetProducts(categoryId);
                }
            }
        });
    });
}

function changePageText(pageChangeSymbol) {
    const pageButtons = document.querySelectorAll('.pageButton');

    if (pageChangeSymbol === "plus") {
        currentPage++;
    } else if (pageChangeSymbol !== "select") {
        currentPage--;
    } else {
        currentPage = selectedPage;
    }

    if (currentPage > totalPageCount) {
        currentPage--;
        outOfRange = true;
    }
    else if (currentPage < 1) {
        currentPage++;
        outOfRange = true;
    }
    else {
        outOfRange = false;
        pageButtons.forEach((btn, index) => {
            if (btn.innerText == currentPage.toString()) {
                btn.classList.add("selectedPage");
                selectedPage = parseInt(btn.innerText);
            } else {
                btn.classList.remove("selectedPage");
            }

            if (totalPageCount > 6) {
                if (currentPage === totalPageCount - 2 && (pageChangeSymbol === "plus" || pageChangeSymbol === "select")) {
                    pageButtons[1].innerText = "...";
                    pageButtons[2].innerText = totalPageCount - 4;
                    pageButtons[3].innerText = totalPageCount - 3;
                    pageButtons[4].innerText = totalPageCount - 2;
                    pageButtons[5].innerText = totalPageCount - 1;
                    pageButtons[6].innerText = totalPageCount;
                }
                else if (currentPage >= totalPageCount - 3 && (pageChangeSymbol === "minus" || pageChangeSymbol === "select")) {
                    pageButtons[1].innerText = "...";
                    pageButtons[2].innerText = totalPageCount - 4;
                    pageButtons[3].innerText = totalPageCount - 3;
                    pageButtons[4].innerText = totalPageCount - 2;
                    pageButtons[5].innerText = totalPageCount - 1;
                    pageButtons[6].innerText = totalPageCount;
                }
                else if (currentPage <= 4) {
                    pageButtons[1].innerText = '2';
                    pageButtons[2].innerText = '3';
                    pageButtons[3].innerText = '4';
                    pageButtons[4].innerText = '5';
                    pageButtons[5].innerText = '...';
                }
                else if (currentPage === totalPageCount - 2 && (pageChangeSymbol === "minus" || pageChangeSymbol === "select")) {
                    pageButtons[5].innerText = '...';
                    pageButtons[1].innerText = '2';
                }
                else if (currentPage > 4 && currentPage < totalPageCount - 1) {
                    pageButtons[1].innerText = '...';
                    pageButtons[2].innerText = currentPage - 1;
                    pageButtons[3].innerText = currentPage;
                    pageButtons[4].innerText = currentPage + 1;
                    pageButtons[5].innerText = '...';
                }

            } else {
                pageButtons[index].innerText = index + 1;
            }
        });
    }
}

function setPageSize(count) {
    const paginationDiv = document.getElementById("paginationDiv");
    const pagesDiv = document.querySelector(".pages");
    var pageCount = count / pageSize;

    pageCount = Math.ceil(pageCount);
    totalPageCount = pageCount;

    if (pageCount > 1) {
        paginationDiv.style.visibility = "visible";
        paginationDiv.style.height = "auto";
    } else {
        paginationDiv.style.visibility = "hidden";
        paginationDiv.style.height = "0px";
    }

    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'pageButton';
        if (i === 1) {
            pageButton.className += ' selectedPage';
        }
        if (pageCount <= 7) {
            pageButton.innerText = i;
            pagesDiv.appendChild(pageButton);
        } else {
            if (i <= 5) {
                pageButton.innerText = i;
                pagesDiv.appendChild(pageButton);
            } else if (i === 6) {
                pageButton.innerText = "...";
                pageButton.className += ' selectorButtonRight';
                pagesDiv.appendChild(pageButton);
            } else if (i === pageCount) {
                const lastButton = document.createElement('button');
                lastButton.className = 'pageButton lastPageButton';
                lastButton.innerText = pageCount;
                pagesDiv.appendChild(lastButton);
                break;
            }
        }
    }
    selectPageFunctionalyty();
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

document.querySelector(".submitFiltersButton").addEventListener("click", function () {
    const filters = selectedFiltersArray;
    const queryParams = new URLSearchParams();

    if (filters.CountryOfManufacture.length > 0) {
        queryParams.append("countries", filters.CountryOfManufacture.join(","));
    }
    if (filters.TradeMarks.length > 0) {
        queryParams.append("trademarks", filters.TradeMarks.join(","));
    }

    const minPriceInput = document.querySelector(".min-input");
    const maxPriceInput = document.querySelector(".max-input");

    if (minPriceInput && minPriceInput.value) {
        queryParams.append("minPrice", minPriceInput.value);
    }
    if (maxPriceInput && maxPriceInput.value) {
        queryParams.append("maxPrice", maxPriceInput.value);
    }

    queryParams.append("sort", sortName || "");
    const newUrl = `/Goodmeal/Category/${categoryId}?${queryParams.toString()}`;
    window.location.href = newUrl;
});

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


///Filter Params
function FilterParams() {
    var checkboxContainers = document.querySelectorAll(".checkboxContainer");
    var clearAllFilters = document.getElementById("clearAllFilters");
    const selectedFiltersDiv = document.querySelector(".selectedFiltersDiv");
    const selectedFiltersList = document.getElementById("selectedFiltersList");
    const selectedFilters = document.getElementById("selectedItems");

    function checkFiltersVisibility() {
        if (selectedFiltersList.children.length === 0) {
            selectedFiltersDiv.style.visibility = 'hidden';
            selectedFiltersDiv.style.padding = '0px';
            selectedFiltersDiv.style.height = '0px';
            selectedFiltersDiv.style.borderTop = '0px';
        } else {
            selectedFiltersDiv.style.visibility = 'visible';
            selectedFiltersDiv.style.padding = '15px 0px 0px 6px';
            selectedFiltersDiv.style.height = 'auto';
            selectedFiltersDiv.style.borderTop = '1px solid #BDBDBD';
        }
    }

    clearAllFilters.addEventListener("click", function () {

        const selectedFiltersList = document.getElementById("selectedFiltersList");
        selectedFiltersList.innerHTML = '';

        const checkboxes = document.querySelectorAll(".checkboxContainer input[type='checkbox']");
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        selectedFiltersCount = 0;
        selectedFilters.innerText = selectedFiltersCount;
        selectedFiltersArray = {
            CountryOfManufacture: [],
            TradeMarks: [],
            MinPrice: 0,
            MaxPrice: 0,
        };
        checkFiltersVisibility();
    });

    checkboxContainers.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const filterName = checkbox.querySelector(".filterName");
            const checkboxInput = checkbox.querySelector("input[type='checkbox']");

            const filterCategoryDiv = checkbox.closest('.filterDiv').querySelector('.infoTitleDiv');
            const filterCategory = filterCategoryDiv ? filterCategoryDiv.innerText.trim() : "";

            if (checkboxInput.checked) {
                addSelectedFilter(filterName.innerText, checkboxInput);
                selectedFiltersCount++;
            } else {
                removeSelectedFilter(filterName.innerText, filterCategory);
                selectedFiltersCount--;
            }

            selectedFilters.innerText = selectedFiltersCount;

            checkFiltersVisibility();
        });
    });

    function addSelectedFilter(text, checkboxInput) {
        const selectedFiltersList = document.getElementById("selectedFiltersList");

        const filterCategoryDiv = checkboxInput.closest('.filterDiv').querySelector('.infoTitleDiv');
        const filterCategory = filterCategoryDiv ? filterCategoryDiv.innerText.trim() : "";

        if (!Array.from(selectedFiltersList.children).some(item => item.querySelector(".selectedFilterText").innerText === text)) {
            const newFilter = document.createElement("div");
            newFilter.className = "selectedFilter";

            const filterText = document.createElement("span");
            filterText.className = "selectedFilterText";
            filterText.innerText = text;

            const filterDelete = document.createElement("span");
            filterDelete.className = "selectedFilterDelete";
            filterDelete.innerText = "x";

            if (filterCategory === "Країна") {
                selectedFiltersArray.CountryOfManufacture.push(text);
            } else if (filterCategory === "Торгова марка") {
                selectedFiltersArray.TradeMarks.push(text);
            }

            filterDelete.addEventListener("click", () => {
                newFilter.remove();
                checkboxInput.checked = false;

                if (filterCategory === "Країна") {
                    selectedFiltersArray.CountryOfManufacture = selectedFiltersArray.CountryOfManufacture.filter(item => item !== text);
                } else if (filterCategory === "Торгова марка") {
                    selectedFiltersArray.TradeMarks = selectedFiltersArray.TradeMarks.filter(item => item !== text);
                }

                checkFiltersVisibility();
            });

            newFilter.appendChild(filterText);
            newFilter.appendChild(filterDelete);
            selectedFiltersList.appendChild(newFilter);
            checkFiltersVisibility();
        }
    }

    function removeSelectedFilter(text, filterCategory) {
        const selectedFiltersList = document.getElementById("selectedFiltersList");
        const filterToRemove = Array.from(selectedFiltersList.children).find(item => item.querySelector(".selectedFilterText").innerText === text);

        if (filterToRemove) {
            filterToRemove.remove();

            if (filterCategory === "Країна") {
                selectedFiltersArray.CountryOfManufacture = selectedFiltersArray.CountryOfManufacture.filter(item => item !== text);
            } else if (filterCategory === "Торгова марка") {
                selectedFiltersArray.TradeMarks = selectedFiltersArray.TradeMarks.filter(item => item !== text);
            }
        }

        checkFiltersVisibility();
    }
}

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


//Slider
const slider = document.querySelector(".range-slider");
const progress = slider.querySelector(".progress");
const minPriceInput = slider.querySelector(".min-price");
const maxPriceInput = slider.querySelector(".max-price");
const minInput = slider.querySelector(".min-input");
const maxInput = slider.querySelector(".max-input");

const updateProgress = () => {
    const minValue = parseInt(minInput.value);
    const maxValue = parseInt(maxInput.value);

    const range = maxInput.max - minInput.min;
    const valueRange = maxValue - minValue;
    const width = (valueRange / range) * 100;
    const minOffset = ((minValue - minInput.min) / range) * 100;

    progress.style.width = width + "%";
    progress.style.left = minOffset + "%";

    minPriceInput.value = minValue;
    maxPriceInput.value = maxValue;
};

const updateRange = (event) => {
    const input = event.target;

    let min = parseInt(minPriceInput.value);
    let max = parseInt(maxPriceInput.value);

    if (input === minPriceInput && min > max) {
        max = min;
        maxPriceInput.value = max;
    } else if (input === maxPriceInput && max < min) {
        min = max;
        minPriceInput.value = min;
    }

    minInput.value = min;
    maxInput.value = max;

    updateProgress();
};

minPriceInput.addEventListener("input", updateRange);
maxPriceInput.addEventListener("input", updateRange);

minInput.addEventListener("input", () => {
    if (parseInt(minInput.value) >= parseInt(maxInput.value)) {
        maxInput.value = minInput.value;
    }
    updateProgress();
});

maxInput.addEventListener("input", () => {
    if (parseInt(maxInput.value) <= parseInt(minInput.value)) {
        minInput.value = maxInput.value;
    }
    updateProgress();
});

let isDragging = false;
let startOffsetX;

progress.addEventListener("mousedown", (e) => {
    e.preventDefault();

    isDragging = true;

    startOffsetX = e.clientX - progress.getBoundingClientRect().left;

    slider.classList.toggle("dragging", isDragging);
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const sliderRect = slider.getBoundingClientRect();
        const progressWidth = parseFloat(progress.style.width || 0);

        let newLeft =
            ((e.clientX - sliderRect.left - startOffsetX) / sliderRect.width) * 100;

        newLeft = Math.min(Math.max(newLeft, 0), 100 - progressWidth);

        progress.style.left = newLeft + "%";

        const range = maxInput.max - minInput.min;
        const newMin = Math.round((newLeft / 100) * range) + parseInt(minInput.min);
        const newMax = newMin + parseInt(maxInput.value) - parseInt(minInput.value);

        minInput.value = newMin;
        maxInput.value = newMax;

        updateProgress();
    }
    slider.classList.toggle("dragging", isDragging);
});

document.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
    }
    slider.classList.toggle("dragging", isDragging);
});

updateProgress();
