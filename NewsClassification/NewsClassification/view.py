from django.http import HttpResponse

def showStatus404(request):
    return HttpResponse("page is not exist :(", status=404)
