import json
import time

from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import CreateUserForm
from django.contrib.auth.models import User
import os


# Create your views here.


def get_home(request):
    return render(request, "manager/index.html")


def register_page(request):
    form = CreateUserForm()

    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            print("Form is valid")
            user = form.save()
            username = form.cleaned_data.get('username')
            # messages.success(request, 'Account was created for ' + username)
            time.sleep(2)
            login(request, user)
            return redirect('dashboard')
    context = {
        "form": form
    }
    return render(request, "manager/register.html", context=context)


def login_page(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.info(request, 'Username or password is incorrect!')
    return render(request, "manager/login.html")


def logout_user(request):
    logout(request)
    return redirect('login')


json_file = open("manager/static/manager/data/data.json")
data = json.load(json_file)
chores = [{"filepath": "manager/images/chores/" + file, "description": data[file]["description"], "score": count + 1,
           "event": data[file]["event_log"]}
          for count, file in enumerate(os.listdir("manager/static/manager/images/chores"))]
rewards = ["manager/images/rewards/" + file for file in os.listdir("manager/static/manager/images/rewards")]


@login_required
@transaction.atomic
def dashboard(request):
    user = get_object_or_404(User, pk=request.user.pk)
    if request.method == "POST":
        user.userprofile.score += int(request.POST['score'])
        user.userprofile.save()
        user.save()
    else:
        redirect('dashboard')

    return render(request, "manager/dashboard.html", {
        'chores': chores,
        'rewards': rewards,
    })

    # user_profile_form = UserProfileForm(request.POST, instance=request.user.userprofile)
    # if user_form.is_valid() and user_profile_form.is_valid():
    #     return redirect('dashboard')
