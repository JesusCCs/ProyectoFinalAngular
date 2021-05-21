import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';
import {ValidatorsExtension} from '../../_helpers/validators-extension';
import {ErrorService} from '../../_services/error.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm!: FormGroup;

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public async forgot(): Promise<void> {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    ErrorService.clean();

    const email = this.forgotForm.value.email;

    const resultado: boolean = await this.authService.forgotPassword(email);

    if (!resultado) {
      ErrorService.showInForm(this.forgotForm);
    } else {
      this.showModal();
    }
  }

  private showModal(): void {
    Swal.fire({
      icon: 'success',
      title: 'Proceso de recuperación iniciado',
      text: 'Si el email que ha colocado está registrado en el sistema, se le enviará un correo donde podrá continuar con los pasos para reiniciar su contraseña.',
      allowOutsideClick: false,
      focusConfirm: true,
      confirmButtonText: 'De acuerdo'
    }).then(_ => this.router.navigateByUrl('/login'));
  }
}
