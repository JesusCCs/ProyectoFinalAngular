import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdbModalRef} from 'mdb-angular-ui-kit';
import {ErrorService} from '../../_services/error.service';
import {Toast} from '../../_models/toast';
import {AuthService} from '../../_services/auth.service';

@Component({
  selector: 'app-modal-change-email',
  templateUrl: './modal-change-email.component.html',
  styleUrls: ['./modal-change-email.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalChangeEmailComponent implements OnInit {

  changeEmail!: FormGroup;

  constructor(public modalRef: MdbModalRef<ModalChangeEmailComponent>,
              private fb: FormBuilder,
              private auth: AuthService) {
  }

  ngOnInit(): void {
    this.changeEmail = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]],
    }, {
      updateOn: 'submit'
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.changeEmail.invalid) {
      this.changeEmail.markAllAsTouched();
      return;
    }

    ErrorService.clean();

    const inputs = this.changeEmail.value;
    const resultado: boolean = await this.auth.changeEmail(inputs.newEmail);

    if (!resultado) {
      ErrorService.showInForm(this.changeEmail);
    } else {
      this.modalRef.close();
      Toast.fire({
        icon: 'success',
        title: 'Correo de verificación en camino...'
      }).then(_ => 0);
    }
  }
}
