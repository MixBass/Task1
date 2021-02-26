from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from NewsCollection import checks
from NewsCollection import functionForNewsXml
from NewsCollection import helpFunctions
from NewsClassification import responseDescription
import json

responseFor400 = responseDescription.responseFor400
responseFor404 = responseDescription.responseFor404
responseFor405 = responseDescription.responseFor405
responseFor415 = responseDescription.responseFor415
responseFor503 = responseDescription.responseFor503

@csrf_exempt
def getNewsByPage(request, page):
    if request.method == "GET":
        page = int(page)
        if checks.checkPage(page):
            resultNews = functionForNewsXml.getNewsByPage(page)
            if resultNews:
                helpFunctions.escapeTextDataInNews(resultNews)
                return HttpResponse(json.dumps(resultNews), content_type="application/json")
            else:
                return HttpResponse(responseFor404, status=404)
        else:
            return HttpResponse(responseFor400, status=400)
    else:
        return HttpResponse(responseFor405, status=405)

@csrf_exempt
def getNewsByCategoryAndByPage(request, category, page):
    if request.method == "GET":
        categoryCheckResult = checks.checkCategoryForGet(category)
        if not categoryCheckResult:
            return HttpResponse(responseFor400, status=400)
        else:
            category = categoryCheckResult

        page = int(page)
        if not checks.checkPage(page):
            return HttpResponse(responseFor400, status=400)

        resultNews = functionForNewsXml.getNewsByCategoryAndByPage(category, page)
        if resultNews:
            helpFunctions.escapeTextDataInNews(resultNews)
            return HttpResponse(json.dumps(resultNews), content_type="application/json")
        else:
            return HttpResponse(responseFor404, status=404)
    else:
        return HttpResponse(responseFor405, status=405)

@csrf_exempt
def getNewsBySearchLineAnByPage(request, searchLine, page):
    if request.method == "GET":
        if not checks.checkSearchLine(searchLine):
            return HttpResponse(responseFor400, status=400)

        page = int(page)
        if not checks.checkPage(page):
            return HttpResponse(responseFor400, status=400)

        resultNews = functionForNewsXml.getNewsBySearchAndByPage(searchLine, page)
        if resultNews:
            helpFunctions.escapeTextDataInNews(resultNews)
            return HttpResponse(json.dumps(resultNews), content_type="application/json")
        else:
            return HttpResponse(responseFor404, status=404)
    else:
        return HttpResponse(responseFor405, status=405)

@csrf_exempt
def addNew(request):
    if request.method == "POST":
        if request.content_type != "application/json":
            return HttpResponse(responseFor415, status=415)

        fieldsInJson = ["link", "category", "date", "title", "author", "text"]
        newInformationDict = checks.checkJson(request.body, fieldsInJson)
        if not newInformationDict:
            return HttpResponse(responseFor400, status=400)

        if not checks.checkLink(newInformationDict["link"]):
            return HttpResponse(responseFor400, status=400)

        if not checks.checkCategoryForNonGet(newInformationDict["category"]):
            return HttpResponse(responseFor400, status=400)

        if not checks.checkDate(newInformationDict["date"]):
            return HttpResponse(responseFor400, status=400)

        if not checks.checkTitle(newInformationDict["title"]):
            return HttpResponse(responseFor400, status=400)

        if not checks.checkAuthor(newInformationDict["author"]):
            return HttpResponse(responseFor400, status=400)

        if not checks.checkText(newInformationDict["text"]):
            return HttpResponse(responseFor400, status=400)

        resultAdd = functionForNewsXml.addNew(newInformationDict["link"], newInformationDict["category"], newInformationDict["date"], newInformationDict["title"], newInformationDict["author"], newInformationDict["text"])
        if resultAdd:
            return HttpResponse("new was created")
        else:
            return HttpResponse(responseFor503, status=503)
    else:
        return HttpResponse(responseFor405, status=405)

@csrf_exempt
def updateOrDeleteOrGetNewById(request, id):
    allowedMethods = ["GET", "DELETE", "PUT"]

    if request.method == "GET":
        resultGet = functionForNewsXml.getNewById(int(id))
        if resultGet:
            helpFunctions.escapeTextDataInNew(resultGet)
            return HttpResponse(json.dumps(resultGet), content_type="application/json")
        else:
            return HttpResponse(responseFor404, status=404)

    if request.method == "DELETE":
        resultDelete = functionForNewsXml.deleteNewById(int(id))

        if resultDelete:
            return HttpResponse("new was deleted")
        else:
            return HttpResponse(responseFor400, status=400)

    if request.method == "PUT":
        if request.content_type != "application/json":
            return HttpResponse(responseFor415, status=415)

        fieldsInJson = ["link", "category", "date", "title", "author", "text"]
        newInformationDict = checks.checkJson(request.body, fieldsInJson)
        if not newInformationDict:
            return HttpResponse(responseFor400, status=400)

        if not checks.checkLink(newInformationDict["link"]):
            return HttpResponse(responseFor400, status=400)

        if not checks.checkCategoryForNonGet(newInformationDict["category"]):
            return HttpResponse(responseFor400, status=400)

        if not checks.checkDate(newInformationDict["date"]):
            return HttpResponse(responseFor400, status=400)

        if not checks.checkTitle(newInformationDict["title"]):
            return HttpResponse(responseFor400, status=400)

        if not checks.checkAuthor(newInformationDict["author"]):
            return HttpResponse(responseFor400, status=400)

        if not checks.checkText(newInformationDict["text"]):
            return HttpResponse(responseFor400, status=400)

        resultPut = functionForNewsXml.updateNew(int(id), newInformationDict["link"], newInformationDict["category"], newInformationDict["date"], newInformationDict["title"], newInformationDict["author"], newInformationDict["text"])
        if resultPut:
            return HttpResponse("new was changed")
        else:
            return HttpResponse(responseFor400, status=400)

    if request.method not in allowedMethods:
        return HttpResponse(responseFor405, status=405)