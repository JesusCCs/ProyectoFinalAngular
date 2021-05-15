import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  loginForm: FormGroup = this.fb.group({
    emailOrUserName: ['', Validators.required],
    password: ['', Validators.required]
  }, { updateOn: 'submit' });

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder) {
  }

  public async login(): Promise<void> {

    const val = this.loginForm.value;

    if (!val.emailOrUserName || !val.password) {
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
