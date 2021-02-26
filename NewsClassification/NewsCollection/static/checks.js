function getTextLimit() {
    return 50000;
}

function getSearchLineLimit() {
    return 100;
}

function getTitleLimit() {
    return 400;
}

function getAuthorLimit() {
    return 100;
}

function getLinkLimit() {
    return 500;
}

function basicCheckStr(strArg, maxLen) {
    if (strArg.trim() != "") {
        if (strArg.length <= maxLen) {
            return "";
        } else {
            return "OutOfLimit";
        }
    } else {
        return "Empty";
    }
}

function checkText(text) {
    return basicCheckStr(text, getTextLimit());
}

function checkSearchLine(searchLine) {
    let basicResult = basicCheckStr(searchLine, getSearchLineLimit());

    if (basicResult != "") {
        return basicResult;
    }

    let words = searchLine.split("-");

    for (let i = 0; i < words.length; i++) {
        if (words[i] == "") {
            return "EmptyWord";
        }
    }

    return "";
}

function checkTitle(title) {
    return basicCheckStr(title, getTitleLimit());
}

function checkAuthor(author) {
    return basicCheckStr(author, getAuthorLimit());
}

function checkLink(link) {
    basicCheckResult = basicCheckStr(link, getLinkLimit());

    if (basicCheckResult == "") {
        let regExpForLink = /^(?:(?:https?):\/\/(?:[a-z0-9_-]{1,32}(?::[a-z0-9_-]{1,32})?@)?)?(?:(?:[a-z0-9-]{1,128}\.)+(?:com|net|org|ru|[a-z]{2})|(?!0)(?:(?!0[^.]|255)[0-9]{1,3}\.){3}(?!0|255)[0-9]{1,3})(?:\/[a-z0-9.,_@%&?+=\~\/-]*)?(?:#[^ \'\"&<>]*)?$/i;
        if (regExpForLink.test(link)) {
            return "";
        } else {
            return "Incorrect";
        }
    } else {
        return basicCheckResult;
    }
}

function checkDate(date) {
    if (date.trim() != "") {
        let regExpForDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$/gm;
        if (regExpForDate.test(date)) {
            let dateInObject = new Date(date);
            let dateInStrForCheck = dateInObject.getFullYear() + '-' + ('0' + (dateInObject.getMonth() + 1)).slice(-2) + '-' + ('0' + dateInObject.getDate()).slice(-2) + " " + ('0' + dateInObject.getHours()).slice(-2) + ":" + ('0' + dateInObject.getMinutes()).slice(-2);
            if (date == dateInStrForCheck) {
                return "";
            } else {
                return "IncorrectDate";
            }
        } else {
            return "IncorrectFormat";
        }
    } else {
        return "Empty";
    }
}

function dateToRightFormat(date) {
    let months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    let weekdays = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
    let dateInObject = new Date(date);

    let resultDate = dateInObject.getDate().toString() + " " + months[dateInObject.getMonth()] + " " + dateInObject.getFullYear().toString() + ", " + weekdays[dateInObject.getDay()] + " " + ('0' + dateInObject.getHours()).slice(-2) + ":" + ('0' + dateInObject.getMinutes()).slice(-2);

    return resultDate;
}

function dateToIntefaceFormat(date) {
    let months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    let regExpForExecuteDate = /^([0-9][0-9]?) (января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря) ([0-9]+), (понедельник|вторник|среда|четверг|пятница|суббота|воскресенье) ([0-9]{2}):([0-9]{2})$/;
    let match = date.match(regExpForExecuteDate);

    let resultDate = match[3] + "-" + ("0" + (months.indexOf(match[2]) + 1)).slice(-2) + "-" + ("0" + match[1]).slice(-2) + " " + match[5] + ":" + match[6];

    return resultDate;
}