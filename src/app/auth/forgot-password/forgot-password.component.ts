import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';
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
    }, {updateOn: 'change'});
  }

  async onSubmit(): Promise<void> {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    ErrorService.clean();

    const email = this.forgotForm.value.email;

    const forgot: boolean = await this.authService.forgotPassword(email);

    if (!forgot) {
      ErrorService.showInForm(this.forgotForm);
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Proceso comenzado!',
        text: 'Si ha escrito correctamente el email, le llegará un correo donde, siguiendo las instrucciones, podrá recuperar su contraseña.',
        allowOutsideClick: false,
        focusConfirm: true,
        confirmButtonText: 'De acuerdo'
      }).then(_ => this.router.navigateByUrl('/login'));
    }
  }
}
