from django.shortcuts import render
from django.http import HttpResponse
from NewsClassification import responseDescription

responseFor405 = responseDescription.responseFor405

def showNewsFilter(request):
    if request.method == "GET":
        return render(request, "NewsCollection/newsFilter.html")
    else:
        return HttpResponse(responseFor405, status=405)

def showNewAdd(request):
    if request.method == "GET":
        return render(request, "NewsCollection/addNew.html")
    else:
        return HttpResponse(responseFor405, status=405)

def showNew(request):
    if request.method == "GET":
        return render(request, "NewsCollection/new.html")
    else:
        return HttpResponse(responseFor405, status=405)