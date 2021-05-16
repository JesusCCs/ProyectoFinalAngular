import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GimnasioHomeComponent} from './gimnasio/gimnasio-home/gimnasio-home.component';
import {AdminHomeComponent} from './admin/admin-home/admin-home.component';
import {LoginComponent} from './auth/login/login.component';
import {GimnasioGuard} from './_guard/gimnasio.guard';
import {AdminGuard} from './_guard/admin.guard';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {SignUpComponent} from './auth/sign-up/sign-up.component';
import {GimnasioLoginComponent} from './gimnasio/gimnasio-login/gimnasio-login.component';
import {AdminLoginComponent} from './admin/admin-login/admin-login.component';

const routes: Routes = [
  { // Rutas de la autenticación
    path: 'auth',
    children: [
      {path: 'forgot', component: ForgotPasswordComponent},
      {path: 'signup', component: SignUpComponent}
    ]
  },
  { // Rutas para el usuario
    path: '',
    canActivate: [GimnasioGuard],
    children: [
      {path: 'login', component: GimnasioLoginComponent},
      {path: '', component: GimnasioHomeComponent}
    ]
  },
  { // Rutas para el administrador
    path: 'admin',
    canActivate: [AdminGuard],
    component: AdminHomeComponent,
    children: [
      {path: 'login', component: AdminLoginComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
