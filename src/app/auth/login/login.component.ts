import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../_services/auth.service';

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

    const inputs = this.loginForm.value;
    const rememberMe = inputs.rememberMe !== '' ? inputs.rememberMe : false;

    const login: boolean = await this.authService.login(inputs.userNameOrEmail, inputs.password, rememberMe, this.type);

    login && this.router.navigateByUrl('/');
  }

  /**
   * Wrapper para obtener los campos del formulario
   */
  get f(): { [p: string]: AbstractControl } {
    return this.loginForm.controls;
  }


}
