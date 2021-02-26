function getNewId() {
    let pathUrl = document.location.pathname;
    let newId = parseInt(pathUrl.slice(pathUrl.lastIndexOf('/') + 1));

    return newId;
}

function getElementsForUpdate() {
    let elementLink = document.getElementById("linkInput");
    let elementCategory = document.getElementById("categoryInput");
    let elementDate = document.getElementById("dateInput");
    let elementTitle = document.getElementById("titleInput");
    let elementAuthor = document.getElementById("authorInput");
    let elementText = document.getElementById("textInput");

    let elementLinkError = document.getElementById("linkError");
    let elementDateError = document.getElementById("dateError");
    let elementTitleError = document.getElementById("titleError");
    let elementAuthorError = document.getElementById("authorError");
    let elementTextError = document.getElementById("textError");

    elementAuthorError.textContent = "";
    elementDateError.textContent = "";
    elementTitleError.textContent = "";
    elementLinkError.textContent = "";
    elementTextError.textContent = "";

    let elements = {
        elementLink: elementLink,
        elementLinkError: elementLinkError,
        elementCategory: elementCategory,
        elementDate: elementDate,
        elementDateError: elementDateError,
        elementTitle: elementTitle,
        elementTitleError: elementTitleError,
        elementAuthor: elementAuthor,
        elementAuthorError: elementAuthorError,
        elementText: elementText,
        elementTextError: elementTextError
    };

    return elements;
}

function getElementsForShowOrUpdate() {
    let elementTitle = document.getElementById("title");
    let elementPreloader = document.getElementById("preloader");
    let elementContainerHeadTitle = document.getElementById("containerHeadTitle");
    let elementContainerLink = document.getElementById("containerLink");
    let elementContainerCategory = document.getElementById("containerCategory");
    let elementContainerDate = document.getElementById("containerDate");
    let elementContainerTitle = document.getElementById("containerTitle");
    let elementContainerAuthor = document.getElementById("containerAuthor");
    let elementContainerText = document.getElementById("containerText");
    let elementContainerButtons = document.getElementById("containerButtons");
    let elementContainerResult = document.getElementById("containerResult");
    let elementContainerContent = document.getElementById("content");

    elementPreloader.hidden = false;
    elementTitle.textContent = "New";
    elementContainerHeadTitle.textContent = "";
    elementContainerLink.textContent = "";
    elementContainerCategory.textContent = "";
    elementContainerDate.textContent = "";
    elementContainerTitle.textContent = "";
    elementContainerAuthor.textContent = "";
    elementContainerText.textContent = "";
    elementContainerButtons.textContent = "";
    elementContainerResult.textContent = "";

    let elements = {
        title: elementTitle,
        preloader: elementPreloader,
        containerHeadTitle: elementContainerHeadTitle,
        containerLink: elementContainerLink,
        containerCategory: elementContainerCategory,
        containerDate: elementContainerDate,
        containerTitle: elementContainerTitle,
        containerAuthor: elementContainerAuthor,
        containerText: elementContainerText,
        containerButtons: elementContainerButtons,
        containerResult: elementContainerResult,
        content: elementContainerContent
    };

    return elements;
}

async function showNew() {
    let elements = getElementsForShowOrUpdate();
    let newId = getNewId();

    try {
        let response = await fetch("/rest-api/news/" + newId.toString(), {
            method: "GET"
        });

        if (response.ok) {
            let newInformation = await response.json();

            elements.preloader.hidden = true;
            elements.title.textContent = newInformation.title;
            elements.containerHeadTitle.innerHTML = "<h2>" + newInformation.title + "</h2>";
            elements.containerLink.innerHTML = "<p><b>Ссылка на новость:</b> " + newInformation.link + "</p>";
            elements.containerCategory.innerHTML = "<p><b>Категория:</b> " + newInformation.category + "</p>";
            elements.containerDate.innerHTML = "<p><b>Дата публикации:</b> " + newInformation.date + "</p>";
            elements.containerAuthor.innerHTML = "<p><b>Автор:</b> " + newInformation.author + "</p>";
            elements.containerText.innerHTML = "<p>" + newInformation.text + "</p>";

            let buttons = '<button onclick="showNewForUpdate()">Редактировать</button>';
            buttons = buttons + '<button onclick="deleteNew()">Удалить</button>';
            elements.containerButtons.innerHTML = buttons;
        } else {
            elements.preloader.hidden = true;
            elements.title.textContent = "Oops";
            if (response.status == 404) {
                elements.content.textContent = "Такой новости не существует :(";
            } else {
                elements.content.textContent = "Возникла проблема. Повторите запрос";
            }
        }
    } catch (error) {
        elements.preloader.hidden = true;
        elements.title.textContent = "Oops";
        elements.content.textContent = "Ошибка: " + error;
    }
}

async function showNewForUpdate() {
    let elements = getElementsForShowOrUpdate();
    let newId = getNewId();

    try {
        let response = await fetch("/rest-api/news/" + newId.toString(), {
            method: "GET"
        });

        if (response.ok) {
            let newInformation = await response.json();

            elements.preloader.hidden = true;
            elements.title.textContent = newInformation.title;
            elements.containerHeadTitle.innerHTML = "<h2>" + newInformation.title + "</h2>";
            elements.containerLink.innerHTML = '<p>Ссылка на новость:</p><input id="linkInput" type="text" /><p id="linkError"></p>';
            elements.containerCategory.innerHTML = '<p>Категория:</p><select id="categoryInput"><option>Новости Hardware</option><option>Новости Software</option><option>Новости IT-рынка</option><option>Новости Сайта</option></select>';
            elements.containerDate.innerHTML = '<p>Дата публикации:</p><input id="dateInput" type="datetime" placeholder="yyyy-mm-dd HH:MM" /><p id="dateError"></p>';
            elements.containerTitle.innerHTML = '<p>Заголовок:</p><input id="titleInput" type="text" /><p id="titleError"></p>';
            elements.containerAuthor.innerHTML = '<p>Автор:</p><input id="authorInput" type="text" /><p id="authorError"></p>';
            elements.containerText.innerHTML = '<p>Текст новости:</p><textarea id="textInput" rows="15" cols="120"></textarea><p id="textError"></p>';

            let elementsForUpdate = getElementsForUpdate();

            elementsForUpdate.elementLink.value = newInformation.link;
            elementsForUpdate.elementCategory.value = newInformation.category;
            elementsForUpdate.elementDate.value = dateToIntefaceFormat(newInformation.date);
            elementsForUpdate.elementTitle.value = newInformation.title;
            elementsForUpdate.elementAuthor.value = newInformation.author;
            elementsForUpdate.elementText.value = newInformation.text;

            let buttons = '<button onclick="updateNew()">Сохранить изменения</button>';
            buttons = buttons + '<button onclick="showNew()">Отменить</button>';
            buttons = buttons + '<button onclick="deleteNew()">Удалить</button>';
            elements.containerButtons.innerHTML = buttons;
        } else {
            elements.preloader.hidden = true;
            elements.title.textContent = "Oops";
            if (response.status == 404) {
                elements.content.textContent = "Такой новости не существует :(";
            } else {
                elements.content.textContent = "Возникла проблема. Повторите запрос";
            }
        }
    } catch (error) {
        elements.preloader.hidden = true;
        elements.title.textContent = "Oops";
        elements.content.textContent = "Ошибка: " + error;
    }
}

async function deleteNew() {
    let elementPreloader = document.getElementById("preloader");
    let elementContent = document.getElementById("content");
    let elementContainerResult = document.getElementById("containerResult");

    let newId = getNewId();

    elementPreloader.hidden = false;
    elementContainerResult.textContent = "";

    try {
        let response = await fetch("/rest-api/news/" + newId.toString(), {
            method: "DELETE"
        });

        if (response.ok) {
            elementContent.textContent = "Новость успешно удалена";
        } else {
            if (response.status == 400) {
                elementContent.textContent = "Новость уже была удалена";
            } else {
                elementPreloader.hidden = true;
                elementContainerResult.innerHTML = "<p>Возникла проблема. Повторите запрос</p>";
            }
        }
    } catch (error) {
        elementPreloader.hidden = true;
        elementContainerResult.innerHTML = "<p>Ошибка: " + error + "</p>";
    }
}

async function updateNew() {
    let elements = getElementsForUpdate();
    let elementResult = document.getElementById("containerResult");
    let elementPreloader = document.getElementById("preloader");
    let elementContent = document.getElementById("content");
    let newId = getNewId();
    elementPreloader.hidden = false;
    elementResult.textContent = "";

    let link = elements.elementLink.value;
    let category = elements.elementCategory.value;
    let date = elements.elementDate.value;
    let title = elements.elementTitle.value;
    let author = elements.elementAuthor.value;
    let text = elements.elementText.value;

    let checkLinkResult = "";
    let checkDateResult = "";
    let checkTitleResult = "";
    let checkAuthorResult = "";
    let checkTextResult = "";

    let flagForRequest = true;

    checkLinkResult = checkLink(link);
    if (checkLinkResult != "") {
        flagForRequest = false;
        if (checkLinkResult == "Empty") {
            elements.elementLinkError.textContent = "Ссылка на новость не заполнена";
        } else {
            if (checkLinkResult == "OutOfLimit") {
                elements.elementLinkError.textContent = "Ссылка на новость слишком длинная. Допустимая длина: " + getLinkLimit().toString();
            } else {
                if (checkLinkResult == "Incorrect") {
                    elements.elementLinkError.textContent = "Это не ссылка на новость";
                }
            }
        }
    }

    checkDateResult = checkDate(date);
    if (checkDateResult != "") {
        flagForRequest = false;
        if (checkDateResult == "Empty") {
            elements.elementDateError.textContent = "Дата публикации не заполнена";
        } else {
            if (checkDateResult == "IncorrectFormat") {
                elements.elementDateError.textContent = "У даты некорректный формат";
            } else {
                if (checkDateResult == "IncorrectDate") {
                    elements.elementDateError.textContent = "Некорректная дата";
                }
            }
        }
    } else {
        date = dateToRightFormat(date);
    }

    checkTitleResult = checkTitle(title);
    if (checkTitleResult != "") {
        flagForRequest = false;
        if (checkTitleResult == "Empty") {
            elements.elementTitleError.textContent = "Заголовок не заполнен";
        } else {
            if (checkTitleResult == "OutOfLimit") {
                elements.elementTitleError.textContent = "Заголовок слишком длинный. Допустимая длина: " + getTitleLimit().toString();
            }
        }
    }

    checkAuthorResult = checkAuthor(author);
    if (checkAuthorResult != "") {
        flagForRequest = false;
        if (checkAuthorResult == "Empty") {
            elements.elementAuthorError.textContent = "Никнейм автора новости не заполнен";
        } else {
            if (checkAuthorResult == "OutOfLimit") {
                elements.elementAuthorError.textContent = "Никнейм автора новости слишком длинный. Допустимая длина: " + getAuthorLimit().toString();
            }
        }
    }

    checkTextResult = checkText(text);
    if (checkTextResult != "") {
        flagForRequest = false;
        if (checkTextResult == "Empty") {
            elements.elementTextError.textContent = "Текст новости не заполнен";
        } else {
            if (checkTextResult == "OutOfLimit") {
                elements.elementTextError.textContent = "Текст новости слишком длинный. Допустимая длина: " + getTextLimit().toString();
            }
        }
    }

    if (flagForRequest) {
        let jsonForRequest = {
            link: link,
            category: category,
            date: date,
            title: title,
            author: author,
            text: text
        };

        try {
            let response = await fetch("/rest-api/news/" + newId.toString(), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jsonForRequest)
            });

            elementPreloader.hidden = true;
            if (response.ok) {
                await showNew();
                elementResult.innerHTML = "<p>Новость успешно изменена</p>";
            } else {
                if (response.status == 400) {
                    elementContent.textContent = "Новость уже удалена";
                } else {
                    elementResult.innerHTML = "<p>Возникла проблема. Повторите запрос</p>";
                }
            }
        } catch (error) {
            elementPreloader.hidden = true;
            elementResult.innerHTML = "<p>Ошибка: " + error + "</p>";
        }
    } else {
        elementPreloader.hidden = true;
        elementResult.innerHTML = "<p>Некоторые поля некорректно заполнены</p>";
    }
}