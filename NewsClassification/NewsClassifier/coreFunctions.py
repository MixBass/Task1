from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import Pipeline
from sklearn import metrics
from string import punctuation
from nltk.corpus import stopwords
from pymystem3 import Mystem
import lxml.etree as ET
import pickle
import os
from NewsCollection import functionForNewsXml
from NewsClassification import settings

newsPrecDir = "newsPrec"
pathForNewsDir = functionForNewsXml.absolutePathForNews
pathForNewsPrecDir = settings.BASE_DIR + functionForNewsXml.delimiter + newsPrecDir
filenameOfModelClassifier = "modelCL.txt"
filenameOfMetrics = "metrics.txt"
pathForModelClassifier = settings.BASE_DIR + functionForNewsXml.delimiter + filenameOfModelClassifier
pathForMetricsOfClassifier = settings.BASE_DIR + functionForNewsXml.delimiter + filenameOfMetrics
sizeOfTestSelection = 0.2
mystem = Mystem()
categoriesList = ["Новости Hardware", "Новости Software", "Новости IT-рынка", "Новости Сайта"]
categoriesDict = {}
categoriesDictReverse = {}
for i in range(len(categoriesList)):
    categoriesDict[categoriesList[i]] = i + 1
    categoriesDictReverse[i + 1] = categoriesList[i]

def getSelectionForClassifier():
    selection = {}
    selection["train"] = {}
    selection["test"] = {}
    selection["train"]["text"] = []
    selection["train"]["category"] = []
    selection["test"]["text"] = []
    selection["test"]["category"] = []

    selectionCategoriesDict = {}
    for category in categoriesList:
        selectionCategoriesDict[category] = [[], []]

    namesXmlFiles = os.listdir(pathForNewsDir)

    for filename in namesXmlFiles:
        xmlRoot = ET.parse(pathForNewsPrecDir + functionForNewsXml.delimiter + filename)
        categoryInFile = xmlRoot.find("/category").text
        textInFile = xmlRoot.find("/text").text
        selectionCategoriesDict[categoryInFile][0].append(textInFile)
        selectionCategoriesDict[categoryInFile][1].append(categoriesDict[categoryInFile])

    for category in categoriesList:
        textTrain, textTest, categoryTrain, categoryTest = train_test_split(selectionCategoriesDict[category][0], selectionCategoriesDict[category][1], test_size=sizeOfTestSelection, random_state=0)
        selection["train"]["text"] = selection["train"]["text"] + textTrain
        selection["train"]["category"] = selection["train"]["category"] + categoryTrain
        selection["test"]["text"] = selection["test"]["text"] + textTest
        selection["test"]["category"] = selection["test"]["category"] + categoryTest

    return selection

def preprocessingText(text):
    text = text.lower()
    lemmas = mystem.lemmatize(text)
    text = " ".join(lemmas)
    return text

def preprocessingCollectionNews():
    namesXmlFiles = os.listdir(pathForNewsDir)

    for name in namesXmlFiles:
        xmlRoot = ET.parse(pathForNewsDir + functionForNewsXml.delimiter + name)
        category = xmlRoot.find("/category").text
        text = xmlRoot.find("/text").text
        text = preprocessingText(text)

        functionForNewsXml.writeXmlFile(int(name[:name.find(".")]), "", category, "", "", "", text, pathForNewsPrecDir)


def saveMetricsInFile(text):
    fileForMetrics = open(pathForMetricsOfClassifier, "w")
    fileForMetrics.write(text)
    fileForMetrics.close()

def fitClassifierModel():
    selection = getSelectionForClassifier()

    model = Pipeline([('vectorizer', CountVectorizer(stop_words=getListOfStopWords())), ('svm', SGDClassifier(max_iter=7, tol=None, alpha=0.001))])
    model.fit(selection["train"]["text"], selection["train"]["category"])

    testResults = model.predict(selection["test"]["text"])
    metricsInStr = metrics.classification_report(selection["test"]["category"], testResults, target_names=categoriesList)

    saveInFileClassifierModel(model)
    saveMetricsInFile(metricsInStr)

def classifyNew(text):
    resultOfClassify = {}
    text = preprocessingText(text)
    model = readFromFileClassifierModel()

    numberOfCategory = model.predict([text])[0]
    resultOfClassify["category"] = categoriesDictReverse[numberOfCategory]
    return resultOfClassify

def getListOfStopWords():
    listOfStopWords = stopwords.words("russian")
    listOfStopWords = listOfStopWords + list(punctuation)
    return listOfStopWords

def saveInFileClassifierModel(model):
    fileForModel = open(pathForModelClassifier, "wb")
    pickle.dump(model, fileForModel)
    fileForModel.close()

def readFromFileClassifierModel():
    fileForModel = open(pathForModelClassifier, "rb")
    model = pickle.load(fileForModel)
    fileForModel.close()
    return model
