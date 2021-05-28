import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MisDatosComponent} from './gimnasio/mis-datos/mis-datos.component';
import {AdminHomeComponent} from './admin/admin-home/admin-home.component';
import {GimnasioGuard} from './_guard/gimnasio.guard';
import {AdminGuard} from './_guard/admin.guard';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {SignUpComponent} from './auth/sign-up/sign-up.component';
import {GimnasioLoginComponent} from './gimnasio/gimnasio-login/gimnasio-login.component';
import {AdminLoginComponent} from './admin/admin-login/admin-login.component';
import {ConfirmEmailComponent} from './auth/confirm-email/confirm-email.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {ConfirmNewEmailComponent} from './auth/confirm-new-email/confirm-new-email.component';
import {MisAnunciosComponent} from './gimnasio/mis-anuncios/mis-anuncios.component';

const routes: Routes = [
  { // Rutas de la autenticación
    path: 'auth',
    children: [
      {path: 'forgot', component: ForgotPasswordComponent},
      {path: 'signup', component: SignUpComponent},
      {path: 'confirm-email', component: ConfirmEmailComponent},
      {path: 'confirm-new-email', component: ConfirmNewEmailComponent},
      {path: 'reset-password', component: ResetPasswordComponent},
      {path: '**', redirectTo: '/login'}
    ]
  },
  { // Rutas para el usuario
    path: '',
    canActivate: [GimnasioGuard],
    children: [
      {path: '', component: MisDatosComponent},
      {path: 'login', component: GimnasioLoginComponent},
      {path: 'anuncios', component: MisAnunciosComponent},
      {path: '**', redirectTo: ''}
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
