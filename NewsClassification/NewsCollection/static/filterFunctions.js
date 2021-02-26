function getAndSetStartElements() {
    let elementFilterResult = document.getElementById("filterResult");
    let elementFilterError = document.getElementById("filterError");
    let elementPreloader = document.getElementById("preloader");
    let elementContainerNews = document.getElementById("newsPreview");
    let elementContainerPages = document.getElementById("pages");

    elementPreloader.hidden = false;
    elementFilterResult.textContent = "";
    elementFilterError.textContent = "";
    elementContainerNews.textContent = "";
    elementContainerPages.textContent = "";

    objOfElements = {
        filterResult: elementFilterResult,
        filterError: elementFilterError,
        preloader: elementPreloader,
        containerNews: elementContainerNews,
        containerPages: elementContainerPages
    };

    return objOfElements;
}

async function showAllNews(page) {
    let elements = getAndSetStartElements();

    try {
        let response = await fetch("/rest-api/news/pages/" + page.toString(), {
            method: "GET"
        });

        if (response.ok) {
            let newsInformation = await response.json();

            elements.preloader.hidden = true;
            elements.filterResult.textContent = "Кол-во новостей: " + newsInformation.countNews.toString();
            showNews(newsInformation.newsPreviewInformation);
            showPages("showAllNews", "", 20, newsInformation.countNews, page);
        } else {
            elements.preloader.hidden = true;
            if (response.status == 404) {
                elements.filterError.textContent = "Совпадений не найдено";
            } else {
                elements.filterError.textContent = "Возникла проблема. Повторите запрос";
            }
        }
    } catch (error) {
        elements.preloader.hidden = true;
        elements.filterError.textContent = "Ошибка: " + error;
    }
}

async function showNewsByCategory(category, page) {
    let elements = getAndSetStartElements();

    try {
        let response = await fetch("/rest-api/news/" + category + "/pages/" + page.toString(), {
            method: "GET"
        });

        if (response.ok) {
            let newsInformation = await response.json();

            elements.preloader.hidden = true;
            elements.filterResult.textContent = "Кол-во новостей: " + newsInformation.countNews.toString();
            showNews(newsInformation.newsPreviewInformation);
            showPages("showNewsByCategory", category, 20, newsInformation.countNews, page);
        } else {
            elements.preloader.hidden = true;
            if (response.status == 404) {
                elements.filterError.textContent = "Совпадений не найдено";
            } else {
                elements.filterError.textContent = "Возникла проблема. Повторите запрос";
            }
        }
    } catch (error) {
        elements.preloader.hidden = true;
        elements.filterError.textContent = "Ошибка: " + error;
    }
}

async function showNewsBySearch(searchLine, page) {
    let elements = getAndSetStartElements();
    let resultOfCheck = "";

    if (searchLine == " ") {
        let elementSearchLine = document.getElementById("searchInput");
        searchLine = elementSearchLine.value;
        searchLine = searchInSearchUrl(searchLine);

        resultOfCheck = checkSearchLine(searchLine);

        console.log(searchLine);
        console.log(resultOfCheck);

        if (resultOfCheck != "") {
            elements.preloader.hidden = true;

            if (resultOfCheck == "Empty") {
                elements.filterError.textContent = "Пустой поисковый запрос";
            } else {
                if (resultOfCheck == "OutOfLimit") {
                    elements.filterError.textContent = "Поисковый запрос слишком длинный. Допустимая длина: " + getSearchLineLimit().toString();
                } else {
                    if (resultOfCheck == "EmptyWord") {
                        elements.filterError.textContent = "Запрос содержит пустые слова. Слова могут разделяться через пробельные символы или -";
                    }
                }
            }
        }
    }

    if (resultOfCheck == "") {
        try {
            let response = await fetch("/rest-api/search-news/" + searchLine + "/pages/" + page.toString(), {
                method: "GET"
            });

            if (response.ok) {
                let newsInformation = await response.json();

                elements.preloader.hidden = true;
                elements.filterResult.textContent = "Кол-во новостей: " + newsInformation.countNews.toString();
                showNews(newsInformation.newsPreviewInformation);
                showPages("showNewsBySearch", searchLine, 20, newsInformation.countNews, page);
            } else {
                elements.preloader.hidden = true;
                if (response.status == 404) {
                    elements.filterError.textContent = "Совпадений не найдено";
                } else {
                    elements.filterError.textContent = "Возникла проблема. Повторите запрос";
                }
            }
        } catch (error) {
            elements.preloader.hidden = true;
            elements.filterError.textContent = "Ошибка: " + error;
        }
    }
}

function searchInSearchUrl(searchLine) {
    let result = searchLine;
    let re = /\s+/gm;
    result = result.replace(re, "-");
    return result;
}

function showPages(func, categoryOrSearchLine, countNewsOnPage, countNews, page) {
    let elementPages = document.getElementById("pages");
    let pagesText = "";
    let countPages = Math.ceil(countNews / countNewsOnPage);

    for (let i = 0; i < countPages; i++) {
        if (page != i + 1) {
            pagesText = pagesText + '<button onclick="' + func + "(";
            if (categoryOrSearchLine != "") {
                pagesText = pagesText + "'" + categoryOrSearchLine + "', ";
            }
            pagesText = pagesText + (i + 1).toString() + ')">' + (i + 1).toString() + "</button>";
        } else {
            pagesText = pagesText + '<button onclick="' + func + "(";
            if (categoryOrSearchLine != "") {
                pagesText = pagesText + "'" + categoryOrSearchLine + "', ";
            }
            pagesText = pagesText + (i + 1).toString() + ')"><b>' + (i + 1).toString() + "</b></button>";
        }
    }

    elementPages.innerHTML = pagesText;
}

function showNews(newsInformation) {
    let elementContainerNews = document.getElementById("newsPreview");
    let containerNews = "";

    for (let i = 0; i < newsInformation.length; i++) {
        containerNews = containerNews + '<div><div><a href="/news/' + newsInformation[i].id.toString() + '">';
        containerNews = containerNews + newsInformation[i].title + "</a></div>";
        containerNews = containerNews + "<div><p>Категория: " + newsInformation[i].category + "</p></div>";
        containerNews = containerNews + "<div><p>Автор: " + newsInformation[i].author + "</p></div></div>";
    }

    elementContainerNews.innerHTML = containerNews;
}
