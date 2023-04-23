from django.shortcuts import render
from django.http import HttpResponse
from manage import *

# Create your views here.
def index(request):
    return render(request, 'editor/code.html')

def predict(request):
    if request.method == 'POST':
        code = request.POST.get('code')
        prediction = model.predict(code)
        return HttpResponse(prediction)
