import datetime
from haystack import indexes
from blog.models import Article


class NoteIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document = True, use_template = True)
    
    title = indexes.CharField(model_attr = 'title')
    publish_time = indexes.DateTimeField(model_attr = 'publish_time')
    
    def get_model(self):
        return Article
    
    def index_queryset(self, using = None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.filter(publish_time__lte = datetime.datetime.now())