import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ValidatorsExtension} from '../../_helpers/validators-extension';
import {ErrorService} from '../../_services/error.service';
import {ResetPasswordRequest} from '../../_models/requests';
import Swal from "sweetalert2";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;

  private token!: string;
  private email!: string;

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.required],
      confirmedPassword: ['']
    }, {
      validators: ValidatorsExtension.match('password', 'confirmedPassword'),
      updateOn: 'change'
    });

    this.route.queryParams
      .subscribe(params => {
          this.token = params.token;
          this.email = params.email;
        }
      );
  }

  public async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    ErrorService.clean();

    const resetRequest = {
      token: this.token,
      email: this.email,
      password: this.resetPasswordForm.value.password,
      confirmedPassword: this.resetPasswordForm.value.confirmedPassword
    } as ResetPasswordRequest;

    const resetResult: boolean = await this.authService.resetPassword(resetRequest);

    if (!resetResult) {
      ErrorService.showInForm(this.resetPasswordForm);
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Todo Listo!',
        text: 'Su contraseña ha sido cambiada y puede acceder a su cuenta con ella.',
        allowOutsideClick: false,
        focusConfirm: true,
        confirmButtonText: 'De acuerdo'
      }).then(_ => this.router.navigateByUrl('/login'));
    }
  }
}
