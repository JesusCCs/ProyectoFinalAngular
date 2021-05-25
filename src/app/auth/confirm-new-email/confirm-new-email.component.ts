import {AfterViewInit, Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {AuthService} from '../../_services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-confirm-new-email',
  templateUrl: './confirm-new-email.component.html',
  styleUrls: ['./confirm-new-email.component.scss']
})
export class ConfirmNewEmailComponent implements OnInit, AfterViewInit {
  private token!: string;
  private currentEmail!: string;
  private newEmail!: string;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
          this.token = params.token;
          this.currentEmail = params.currentEmail;
          this.newEmail = params.newEmail;
        }
      );
  }

  async ngAfterViewInit(): Promise<void> {
    const result: boolean = await this.authService.confirmNewEmail(this.token, this.currentEmail, this.newEmail);

    if (!result) {
      this.error();
      return;
    }

    Swal.fire({
      icon: 'success',
      title: '¡Todo Listo!',
      text: 'Su email ha sido verificado, puede iniciar sesión cuando quiera.',
      allowOutsideClick: false,
      focusConfirm: true,
      confirmButtonText: 'De acuerdo'
    }).then(_ => this.router.navigateByUrl('/login'));

  }

  private error(): void {
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'Hubo un fallo inesperado y no se pudo verificar su email. Inténtelo de nuevo pulsando sobre el botón del correo que se le envió.',
      allowOutsideClick: false,
      focusConfirm: true,
      confirmButtonText: 'De acuerdo'
    }).then(_ => this.router.navigateByUrl('/login'));
  }

}
