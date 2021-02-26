from django.conf.urls import include, url
from django.views.static import serve
from django.views.generic import RedirectView
from NewsCollection import api as apiCollection
from NewsClassifier import api as apiClassifier
from NewsClassification import view as projectView
from NewsClassifier import views as classifierViews
from NewsCollection import views as collectionViews
from NewsClassification import settings

urlpatterns = [
    url(r"^rest-api/news/pages/(?P<page>[0-9]+)$", apiCollection.getNewsByPage),
    url(r"^rest-api/news/(?P<category>\w+)/pages/(?P<page>[0-9]+)$", apiCollection.getNewsByCategoryAndByPage),
    url(r"^rest-api/search-news/(?P<searchLine>[\w-]+)/pages/(?P<page>[0-9]+)$", apiCollection.getNewsBySearchLineAnByPage),
    url(r"^rest-api/news/add-new$", apiCollection.addNew),
    url(r"^rest-api/news/(?P<id>[0-9]+)$", apiCollection.updateOrDeleteOrGetNewById),
    url(r"^rest-api/classification-new$", apiClassifier.classifyNew),
    url(r'^favicon\.ico$',RedirectView.as_view(url='/static/images/favicon.ico')),
    url(r"^$", classifierViews.showClassificationPage),
    url(r"^news-filter$", collectionViews.showNewsFilter),
    url(r"^new-add$", collectionViews.showNewAdd),
    url(r"^news/[0-9]+$", collectionViews.showNew),
	url(r'^static/(?P<path>.*)$', serve,{'document_root': settings.STATIC_ROOT})
]

handler404 = projectView.showStatus404
