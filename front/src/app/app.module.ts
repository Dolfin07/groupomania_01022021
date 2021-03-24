import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth-interceptor';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { HeaderNoAuthComponent } from './components/header-no-auth/header-no-auth.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { LoginComponent } from './components/login/login.component';
import { ProfilComponent } from './components/profil/profil.component';
import { PostComponent } from './components/post/post.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { OnePostComponent } from './components/one-post/one-post.component';


import { MainPageComponent } from './pages/main-page/main-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { InscriptionPageComponent } from './pages/inscription-page/inscription-page.component';
import { ProfilPageComponent } from './pages/profil-page/profil-page.component';
import { OnePostPageComponent } from './pages/one-post-page/one-post-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderNoAuthComponent,
    UserFormComponent,
    LoginComponent,
    ProfilComponent,
    PostComponent,
    NotFoundComponent,
    SideBarComponent,
    MainPageComponent,
    LoginPageComponent,
    InscriptionPageComponent,
    ProfilPageComponent,
    OnePostPageComponent,
    OnePostComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
  ],

  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
