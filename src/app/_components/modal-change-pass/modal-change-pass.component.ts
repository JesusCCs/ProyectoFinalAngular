import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MdbModalRef} from 'mdb-angular-ui-kit';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidatorsExtension} from '../../_helpers/validators-extension';
import {ErrorService} from '../../_services/error.service';
import {Toast} from '../../_models/toast';
import {GimnasioService} from '../../_services/gimnasio.service';
import {AuthService} from '../../_services/auth.service';

@Component({
  selector: 'app-modal-change-pass',
  templateUrl: './modal-change-pass.component.html',
  styleUrls: ['./modal-change-pass.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalChangePassComponent implements OnInit {

  updatePass!: FormGroup;

  constructor(public modalRef: MdbModalRef<ModalChangePassComponent>,
              private fb: FormBuilder,
              private auth: AuthService) {
  }

  ngOnInit(): void {
    this.updatePass = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmedNewPassword: ['', Validators.required]
    }, {
      validators: ValidatorsExtension.match('newPassword', 'confirmedNewPassword'),
      updateOn: 'submit'
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.updatePass.invalid) {
      this.updatePass.markAllAsTouched();
      return;
    }

    ErrorService.clean();

    const inputs = this.updatePass.value;
    const resultado: boolean = await this.auth.changePassword(inputs);

    if (!resultado) {
      ErrorService.showInForm(this.updatePass);
    } else {
      this.modalRef.close();
      Toast.fire({
        icon: 'success',
        title: 'Contraseña cambiada con éxito'
      }).then(_ => 0);
    }
  }

}
