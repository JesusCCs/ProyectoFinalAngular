import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  }, {updateOn: 'submit'});

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder) {
  }

  public async forgot(): Promise<void> {

    const email = this.forgotForm.value.email;
    if (!email) { return; }

    const resultado: boolean = await this.authService.forgot(email);

    if (!resultado) {
      console.log('Error');
    } else {
      await this.router.navigateByUrl('/');
    }
  }
}
