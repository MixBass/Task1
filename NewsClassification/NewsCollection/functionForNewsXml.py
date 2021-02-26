import lxml.etree as ET
import os
from NewsClassification import settings

delimiter = "\\"
directoryForNews = 'news'
directoryForMeta = "meta"
absolutePathForNews = settings.BASE_DIR + delimiter + directoryForNews
absolutePathForMeta = settings.BASE_DIR + delimiter + directoryForMeta
countNewsOnPage = 20
incrementFile = "incrementInformation.txt"

def getNewById(id):
    pathToXml = absolutePathForNews + delimiter + str(id) + ".xml"
    if os.path.isfile(pathToXml):
        NewFields = {}
        xmlRoot = ET.parse(pathToXml)
        NewFields["link"] = xmlRoot.find("/link").text
        NewFields["category"] = xmlRoot.find("/category").text
        NewFields["date"] = xmlRoot.find("/date").text
        NewFields["title"] = xmlRoot.find("/title").text
        NewFields["author"] = xmlRoot.find("/author").text
        NewFields["text"] = xmlRoot.find("/text").text
        return NewFields
    else:
        return False


def getStartAndEndIndexOnPage(page, countNewsOnPage, countNews):
    result = {}
    startIndex = (page - 1) * countNewsOnPage
    endIndex = page * countNewsOnPage
    if startIndex < countNews:
        if endIndex > countNews:
            endIndex = countNews
    else:
        return False

    result["start"] = startIndex
    result["end"] = endIndex
    return result
    
def getPreviewInformation(name):
    newsPreviewDict = {}
    newTree = ET.parse(absolutePathForNews + delimiter + name)
    newsPreviewDict["id"] = int(name[:name.find(".")])
    newsPreviewDict["title"] = newTree.find("/title").text
    newsPreviewDict["category"] = newTree.find("/category").text
    newsPreviewDict["author"] = newTree.find("/author").text
    return newsPreviewDict

def getNewsByPage(page):
    namesXmlFiles = os.listdir(absolutePathForNews)
    namesXmlFiles.sort(key=lambda nameFile: int(nameFile[:nameFile.find(".")]), reverse=True)
    countNews = len(namesXmlFiles)
    pageInformation = getStartAndEndIndexOnPage(page, countNewsOnPage, countNews)
    newsDict = {}
    newsDict["newsPreviewInformation"] = []
    newsDict["countNews"] = countNews

    if pageInformation:
        namesXmlFiles = namesXmlFiles[pageInformation["start"]: pageInformation["end"]]
    else:
        return False

    for xmlName in namesXmlFiles:
        newsDict["newsPreviewInformation"].append(getPreviewInformation(xmlName))

    return newsDict

def getNewsByCategoryAndByPage(category, page):
    namesXmlFiles = os.listdir(absolutePathForNews)
    newsDict = {}
    newsDict["newsPreviewInformation"] = []

    for nameFile in namesXmlFiles:
        newPreview = getPreviewInformation(nameFile)
        if newPreview["category"] == category:
            newsDict["newsPreviewInformation"].append(newPreview)

    countNews = len(newsDict["newsPreviewInformation"])
    pageInformation = getStartAndEndIndexOnPage(page, countNewsOnPage, countNews)
    newsDict["countNews"] = countNews

    if pageInformation:
        newsDict["newsPreviewInformation"].sort(key=lambda newPreviewArg: newPreviewArg["id"], reverse=True)
        newsDict["newsPreviewInformation"] = newsDict["newsPreviewInformation"][pageInformation["start"]: pageInformation["end"]]
    else:
        return False

    return newsDict

def getNewsBySearchAndByPage(searchLine, page): #поиск осуществляется по заголовку новости
    namesXmlFiles = os.listdir(absolutePathForNews)
    newsDict = {}
    newsDict["newsPreviewInformation"] = []
    searchWords = list(set(searchLine.lower().split("-")))
    searchWordsLen = len(searchWords)

    for nameFile in namesXmlFiles:
        newPreview = getPreviewInformation(nameFile)
        titleLower = newPreview["title"].lower()
        i = 0
        find = False
        while i < searchWordsLen and not find:
            if searchWords[i] in titleLower:
                find = True
            i = i + 1

        if find:
            newsDict["newsPreviewInformation"].append(newPreview)

    countNews = len(newsDict["newsPreviewInformation"])
    pageInformation = getStartAndEndIndexOnPage(page, countNewsOnPage, countNews)
    newsDict["countNews"] = countNews

    if pageInformation:
        newsDict["newsPreviewInformation"].sort(key=lambda newPreviewArg: newPreviewArg["id"], reverse=True)
        newsDict["newsPreviewInformation"] = newsDict["newsPreviewInformation"][pageInformation["start"]: pageInformation["end"]]
    else:
        return False

    return newsDict

def deleteNewById(id):
    pathToXml = absolutePathForNews + delimiter + str(id) + ".xml"
    if os.path.isfile(pathToXml):
        os.remove(pathToXml)
        return True
    else:
        return False

def writeXmlFile(id, link, category, date, title, author, text, absolutePath):
    notAllowedChars = ["[", "]"]
    title = removeCharsForCDATA(title, notAllowedChars)
    author = removeCharsForCDATA(author, notAllowedChars)
    text = removeCharsForCDATA(text, notAllowedChars)

    newRoot = ET.Element("doc")

    sourceFilexml = ET.SubElement(newRoot, "link")
    sourceFilexml.text = link
    sourceFilexml.attrib["auto"] = "false"
    sourceFilexml.attrib["type"] = "str"
    sourceFilexml.attrib["verify"] = "true"

    categoryFilexml = ET.SubElement(newRoot, "category")
    categoryFilexml.text = ET.CDATA(category)
    categoryFilexml.attrib['verify'] = "true"
    categoryFilexml.attrib['type'] = "str"
    categoryFilexml.attrib['auto'] = "false"

    dateFilexml = ET.SubElement(newRoot, "date")
    dateFilexml.text = ET.CDATA(date)
    dateFilexml.attrib['verify'] = "true"
    dateFilexml.attrib['type'] = "str"
    dateFilexml.attrib['auto'] = "false"

    titleFilexml = ET.SubElement(newRoot, "title")
    titleFilexml.text = ET.CDATA(title)
    titleFilexml.attrib['verify'] = "true"
    titleFilexml.attrib['type'] = "str"
    titleFilexml.attrib['auto'] = "false"

    autorFilexml = ET.SubElement(newRoot, "author")
    autorFilexml.text = ET.CDATA(author)
    autorFilexml.attrib['verify'] = "true"
    autorFilexml.attrib['type'] = "str"
    autorFilexml.attrib['auto'] = "false"

    textsubsFilexml = ET.SubElement(newRoot, "text")
    textsubsFilexml.text = ET.CDATA(text)
    textsubsFilexml.attrib['verify'] = "true"
    textsubsFilexml.attrib['type'] = "str"
    textsubsFilexml.attrib['auto'] = "false"

    tree = ET.ElementTree(newRoot)
    tree.write(absolutePath + delimiter + str(id) + ".xml", encoding="utf-8", xml_declaration=True)

def addNew(link, category, date, title, author, text):
    pathToFileIncrement = absolutePathForMeta + delimiter + incrementFile
    try:
        fileIncrement = open(pathToFileIncrement, 'r')
        id = int(fileIncrement.read())
        fileIncrement.close()
        fileIncrement = open(pathToFileIncrement, 'w')
        fileIncrement.write(str(id + 1))
        fileIncrement.close()
    except OSError:
        return False

    writeXmlFile(id, link, category, date, title, author, text, absolutePathForNews)

    return True

def updateNew(id, link, category, date, title, author, text):
    pathToXml = absolutePathForNews + delimiter + str(id) + ".xml"
    if os.path.isfile(pathToXml):
        os.remove(pathToXml)
        writeXmlFile(id, link, category, date, title, author, text, absolutePathForNews)
        return True
    else:
        return False


def removeCharsForCDATA(strForCDATA, chars):
    for char in chars:
        strForCDATA = strForCDATA.replace(char, "")
    return strForCDATA
