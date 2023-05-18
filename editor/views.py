from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from manage import *

# Create your views here.
def index(request):
    return render(request, 'editor/code.html')

def predict(request):
    if request.method == 'POST':
        code = request.POST.get('code')
        prediction_lang = model.predict(code)
        exp = explainer.explain_instance(code, model.predict_proba)
        
        # predict = [prediction_lang, exp.class_names, exp.predict_proba]


        lang = prediction_lang
        classNames = exp.class_names
        classProbs = exp.predict_proba

        return JsonResponse({'lang': lang.tolist(),'class': classNames.tolist(),'prob' : classProbs.tolist()}, safe=False)