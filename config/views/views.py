from django.http import HttpRequest
from django.shortcuts import render, redirect


def index(request: HttpRequest):
    return render(request, "index.html")