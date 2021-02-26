async function addNew() {
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

    let elementAddNewResult = document.getElementById("addNewResult");
    let elementAddNewError = document.getElementById("addNewError");

    let elementPreloader = document.getElementById("preloader");

    let link = elementLink.value;
    let category = elementCategory.value;
    let date = elementDate.value;
    let title = elementTitle.value;
    let author = elementAuthor.value;
    let text = elementText.value;

    elementPreloader.hidden = false;

    elementAddNewResult.textContent = "";
    elementAddNewError.textContent = "";

    elementLinkError.textContent = "";
    elementDateError.textContent = "";
    elementTitleError.textContent = "";
    elementAuthorError.textContent = "";
    elementTextError.textContent = "";

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
            elementLinkError.textContent = "Ссылка на новость не заполнена";
        } else {
            if (checkLinkResult == "OutOfLimit") {
                elementLinkError.textContent = "Ссылка на новость слишком длинная. Допустимая длина: " + getLinkLimit().toString();
            } else {
                if (checkLinkResult == "Incorrect") {
                    elementLinkError.textContent = "Это не ссылка на новость";
                }
            }
        }
    }

    checkDateResult = checkDate(date);
    if (checkDateResult != "") {
        flagForRequest = false;
        if (checkDateResult == "Empty") {
            elementDateError.textContent = "Дата публикации не заполнена";
        } else {
            if (checkDateResult == "IncorrectFormat") {
                elementDateError.textContent = "У даты некорректный формат";
            } else {
                if (checkDateResult == "IncorrectDate") {
                    elementDateError.textContent = "Некорректная дата";
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
            elementTitleError.textContent = "Заголовок не заполнен";
        } else {
            if (checkTitleResult == "OutOfLimit") {
                elementTitleError.textContent = "Заголовок слишком длинный. Допустимая длина: " + getTitleLimit().toString();
            }
        }
    }

    checkAuthorResult = checkAuthor(author);
    if (checkAuthorResult != "") {
        flagForRequest = false;
        if (checkAuthorResult == "Empty") {
            elementAuthorError.textContent = "Никнейм автора новости не заполнен";
        } else {
            if (checkAuthorResult == "OutOfLimit") {
                elementAuthorError.textContent = "Никнейм автора новости слишком длинный. Допустимая длина: " + getAuthorLimit().toString();
            }
        }
    }

    checkTextResult = checkText(text);
    if (checkTextResult != "") {
        flagForRequest = false;
        if (checkTextResult == "Empty") {
            elementTextError.textContent = "Текст новости не заполнен";
        } else {
            if (checkTextResult == "OutOfLimit") {
                elementTextError.textContent = "Текст новости слишком длинный. Допустимая длина: " + getTextLimit().toString();
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
            let response = await fetch("/rest-api/news/add-new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jsonForRequest)
            });

            elementPreloader.hidden = true;
            if (response.ok) {
                elementAddNewResult.textContent = "Новость добавлена в коллекцию";
            } else {
                elementAddNewError.textContent = "Возникла проблема. Повторите запрос";
            }
        } catch (error) {
            elementPreloader.hidden = true;
            elementAddNewError.textContent = "Ошибка: " + error;
        }
    } else {
        elementPreloader.hidden = true;
        elementAddNewError.textContent = "Некоторые поля некорректно заполнены";
    }
}