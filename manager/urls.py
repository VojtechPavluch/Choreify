from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_home, name="home"),
    path("login/", views.login_page, name="login"),
    path("sign-up/", views.register_page, name="register"),
    path("logout/", views.logout_user, name="logout"),
    path("dashboard/", views.dashboard, name="dashboard"),
    # path("score/", views.score, name="score")
]