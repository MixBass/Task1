from django.shortcuts import render
from django.http import HttpResponse
from NewsClassification import responseDescription

responseFor405 = responseDescription.responseFor405

def showClassificationPage(request):
    if request.method == "GET":
        return render(request, "NewsClassifier/classification.html")
    else:
        return HttpResponse(responseFor405, status=405)
