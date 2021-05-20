import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';
import {ErrorService} from '../../_services/error.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm!: FormGroup;
  file: File|null = null;

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      logo: [null],
      userName: ['', ],
      email: ['', ],
      nombre: ['', ],
      cif: [''],
      direccion: [''],
      tarifa: [''],
      password: [''],
      confirmedPassword: [''],
      descripcion: ['']
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
      await this.router.navigateByUrl('/');
    }
  }

  uploadFile(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files === null) {
      return;
    }

    this.file = files[0];

    this.signUpForm.get('logo')?.updateValueAndValidity();
  }
}
