import re
import json
from datetime import datetime

def checkPage(page):
    if page > 0:
        return True
    else:
        return False

def checkCategoryForGet(category):
    if isinstance(category, str):
        categoryDict = {"hardware":"Новости Hardware", "software":"Новости Software", "it":"Новости IT-рынка", "site":"Новости Сайта"}
        if category in categoryDict.keys():
            return categoryDict[category]
        else:
            False
    else:
        return False

def checkCategoryForNonGet(category):
    if isinstance(category, str):
        categoryDict = ["Новости Hardware", "Новости Software", "Новости IT-рынка", "Новости Сайта"]
        if category in categoryDict:
            return True
        else:
            False
    else:
        return False

def checkLink(link):
    if isinstance(link, str):
        if len(link) > 500:
            return False
        regularExpForLink = r"^(?:(?:https?):\/\/(?:[a-z0-9_-]{1,32}(?::[a-z0-9_-]{1,32})?@)?)?(?:(?:[a-z0-9-]{1,128}\.)+(?:com|net|org|ru|[a-z]{2})|(?!0)(?:(?!0[^.]|255)[0-9]{1,3}\.){3}(?!0|255)[0-9]{1,3})(?:\/[a-z0-9.,_@%&?+=\~\/-]*)?(?:#[^ \'\"&<>]*)?$"
        if re.fullmatch(regularExpForLink, link):
            return True
        else:
            return False
    else:
        return False

def basicCheckStr(strForCheck, lengthLimit):
    if isinstance(strForCheck, str):
        if strForCheck:
            if len(strForCheck) <= lengthLimit:
                return True
            else:
                return False
        else:
            return False
    else:
        return False

def checkTitle(title):
    return basicCheckStr(title, 400)

def checkAuthor(author):
    return basicCheckStr(author, 100)

def checkText(text):
    return basicCheckStr(text, 50000)

def checkSearchLine(searchLine):
    if basicCheckStr(searchLine, 100):
        words = searchLine.split("-")
        for word in words:
            if not word:
                return False
        return True
    else:
        return False

def checkDate(date):
    months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
    daysOfWeek = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"]
    regularExpForDate = r"^([0-9][0-9]?) (января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря) ([0-9]+), (понедельник|вторник|среда|четверг|пятница|суббота|воскресенье) ([0-9]{2}):([0-9]{2})$"
    
    if isinstance(date, str):
        if date:
            resultFullmatch = re.fullmatch(regularExpForDate, date)
            if resultFullmatch:
                try:
                    dateObject = datetime(int(resultFullmatch.group(3)), months.index(resultFullmatch.group(2)) + 1, int(resultFullmatch.group(1)), int(resultFullmatch.group(5)), int(resultFullmatch.group(6)))
                except ValueError:
                    return False
                if daysOfWeek[dateObject.weekday()] == resultFullmatch.group(4):
                    return True
                else:
                    return False
        else:
            return False
    else:
        return False

def checkJson(jsonData, requiredFields):
    try:
        jsonDict = json.loads(jsonData)
    except json.JSONDecodeError:
        return False

    if jsonDict:
        if list(jsonDict.keys()) == requiredFields:
            return jsonDict
        else:
            return False
    else:
        return False
