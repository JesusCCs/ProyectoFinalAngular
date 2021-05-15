import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GimnasioHomeComponent} from './gimnasio/gimnasio-home/gimnasio-home.component';
import {AdminHomeComponent} from './admin/admin-home/admin-home.component';
import {LoginComponent} from './account/login/login.component';
import {UserGuard} from './_guard/user.guard';
import {AdminGuard} from './_guard/admin.guard';
import {ForgotPasswordComponent} from './account/forgot-password/forgot-password.component';
import {SignUpComponent} from './account/sign-up/sign-up.component';

const routes: Routes = [
  { // Rutas de la autenticación
    path: 'auth',
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'forgot', component: ForgotPasswordComponent},
      {path: 'signup', component: SignUpComponent}
    ]
  },
  { // Rutas para el usuario
    path: '',
    canActivate: [UserGuard],
    component: GimnasioHomeComponent,
    children: []
  },
  { // Rutas para el administrador
    path: 'admin',
    canActivate: [AdminGuard],
    component: AdminHomeComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
