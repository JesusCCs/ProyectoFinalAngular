import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../_services/auth.service';
import {ErrorService} from '../../_services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @Input() type!: string;
  loginForm!: FormGroup;

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userNameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [''],
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    ErrorService.clean();

    const inputs = this.loginForm.value;
    const rememberMe = inputs.rememberMe !== '' ? inputs.rememberMe : false;

    const login: boolean = await this.authService.login(inputs.userNameOrEmail, inputs.password, rememberMe, this.type);

    if (!login) {
      ErrorService.show(this.loginForm);
    }

    login && this.router.navigateByUrl('/');
  }

}
