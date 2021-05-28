import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';
import {ErrorService} from '../../_services/error.service';
import {ValidatorsExtension} from '../../_helpers/validators-extension';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm!: FormGroup;
  file: File | null = null;

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      logo: [null],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      cif: ['', [Validators.required, ValidatorsExtension.mustBeAValidCif]],
      direccion: ['', Validators.required],
      tarifa: [1, [Validators.required, Validators.min(1), Validators.max(99)]],
      password: ['', Validators.required],
      confirmedPassword: [''],
      descripcion: ['', Validators.required]
    }, {
      validators: ValidatorsExtension.match('password', 'confirmedPassword'),
      updateOn: 'change'
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    ErrorService.clean();

    const inputs = this.signUpForm.value;

    const signUp: boolean = await this.authService.signUp(inputs, this.file as File);

    if (!signUp) {
      ErrorService.showInForm(this.signUpForm);
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Le llegará un email a su correo para poder completar el registro. ¡No podrá iniciar sesión hasta que confirme su email!.',
        allowOutsideClick: false,
        focusConfirm: true,
        confirmButtonText: 'De acuerdo'
      }).then(_ => this.router.navigateByUrl('/login'));
    }
  }

  uploadFile(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files === null) {
      return;
    }

    this.file = files[0];
  }

  get f(): { [p: string]: AbstractControl } {
    return this.signUpForm.controls;
  }
}
