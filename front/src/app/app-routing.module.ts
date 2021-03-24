import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/authGuard';

import { OnePostPageComponent } from './pages/one-post-page/one-post-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProfilPageComponent } from './pages/profil-page/profil-page.component';
import { InscriptionPageComponent } from './pages/inscription-page/inscription-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

const routes: Routes = [
  { path: 'user/signup', component: InscriptionPageComponent },
  { path: 'user/login', component: LoginPageComponent },
  {
    path: 'user/:id',
    component: ProfilPageComponent,
    canActivate: [AuthGuard],
  },
  { path: 'post', component: MainPageComponent, canActivate: [AuthGuard] },
  {
    path: 'post/:id',
    component: OnePostPageComponent,
    canActivate: [AuthGuard],
  },
  { path: 'not-found', component: NotFoundPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'user/login' },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
