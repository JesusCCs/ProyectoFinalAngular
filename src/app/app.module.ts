import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MdbModule} from 'mdb-angular-ui-kit';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavbarComponent} from './_components/navbar/navbar.component';
import {LoginComponent} from './auth/login/login.component';
import {MisDatosComponent} from './gimnasio/mis-datos/mis-datos.component';
import {AdminHomeComponent} from './admin/admin-home/admin-home.component';
import {ReactiveFormsModule} from '@angular/forms';
import {StorageService} from './_services/storage.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpInterceptorProviders} from './_interceptors';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { GimnasioLoginComponent } from './gimnasio/gimnasio-login/gimnasio-login.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { InputComponent } from './_components/input/input.component';
import {ErrorService} from './_services/error.service';
import { ConfirmEmailComponent } from './auth/confirm-email/confirm-email.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import {BdcWalkModule} from 'bdc-walkthrough';
import { ModalChangePassComponent } from './_components/modal-change-pass/modal-change-pass.component';
import { ModalChangeEmailComponent } from './_components/modal-change-email/modal-change-email.component';
import { TextareaComponent } from './_components/textarea/textarea.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    MisDatosComponent,
    AdminHomeComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    GimnasioLoginComponent,
    AdminLoginComponent,
    InputComponent,
    ConfirmEmailComponent,
    ResetPasswordComponent,
    ModalChangePassComponent,
    ModalChangeEmailComponent,
    TextareaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MdbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BdcWalkModule
  ],
  providers: [
    StorageService,
    ErrorService,
    HttpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
