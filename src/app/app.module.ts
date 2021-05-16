import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MdbModule} from 'mdb-angular-ui-kit';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavbarComponent} from './_components/navbar/navbar.component';
import {LoginComponent} from './auth/login/login.component';
import {GimnasioHomeComponent} from './gimnasio/gimnasio-home/gimnasio-home.component';
import {AdminHomeComponent} from './admin/admin-home/admin-home.component';
import {ReactiveFormsModule} from '@angular/forms';
import {JwtTokenService} from './_services/jwt-token.service';
import {LocalStorageService} from './_services/local-storage.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpInterceptorProviders} from './_interceptors';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { GimnasioLoginComponent } from './gimnasio/gimnasio-login/gimnasio-login.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    GimnasioHomeComponent,
    AdminHomeComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    GimnasioLoginComponent,
    AdminLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MdbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    JwtTokenService,
    LocalStorageService,
    HttpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
