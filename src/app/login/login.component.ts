import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {

    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public async login(): Promise<void> {
    const val = this.form.value;

    if (!val.email || !val.password) {
      return;
    }

    const login: boolean = this.authService.login(val.email, val.password);

    if (!login) {
      console.log('Error');
    } else {
      await this.router.navigateByUrl('/');
    }
  }

}
