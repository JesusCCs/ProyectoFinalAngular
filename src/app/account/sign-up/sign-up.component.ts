import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  signUpForm: FormGroup = this.fb.group({
    logo: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', Validators.required],
    nombre: ['', Validators.required],
    cif: ['', Validators.required],
    direccion: ['', Validators.required],
    tarifa: ['', Validators.required],
    password: ['', Validators.required],
    rPassword: ['', Validators.required],
    descripcion: ['', Validators.required]
  }, {updateOn: 'submit'});

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder) {
  }

  public async signUp(): Promise<void> {

  }
}
