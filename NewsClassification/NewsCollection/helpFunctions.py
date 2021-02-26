from django.utils.html import escape

def escapeTextDataInNews(newsInformation):
    for newPreview in newsInformation["newsPreviewInformation"]:
        newPreview["title"] = escape(newPreview["title"])
        newPreview["author"] = escape(newPreview["author"])

def escapeTextDataInNew(newInformation):
    newInformation["title"] = escape(newInformation["title"])
    newInformation["author"] = escape(newInformation["author"])
    newInformation["text"] = escape(newInformation["text"])
