from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from NewsCollection import checks
from NewsClassifier import coreFunctions
from NewsClassification import responseDescription
import json

responseFor400 = responseDescription.responseFor400
responseFor405 = responseDescription.responseFor405
responseFor415 = responseDescription.responseFor415

@csrf_exempt
def classifyNew(request):
    if request.method == "POST":
        if request.content_type != "application/json":
            return HttpResponse(responseFor415, status=415)

        fieldsInJson = ["text"]
        textInDict = checks.checkJson(request.body, fieldsInJson)

        if not textInDict:
            return HttpResponse(responseFor400, status=400)

        if not checks.checkText(textInDict["text"]):
            return HttpResponse(responseFor400, status=400)

        resultOfClassifier = coreFunctions.classifyNew(textInDict["text"])
        return HttpResponse(json.dumps(resultOfClassifier), content_type="application/json")
    else:
        return HttpResponse(responseFor405, status=405)
