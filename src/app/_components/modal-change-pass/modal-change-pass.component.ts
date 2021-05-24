import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MdbModalRef} from 'mdb-angular-ui-kit';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidatorsExtension} from '../../_helpers/validators-extension';

@Component({
  selector: 'app-modal-change-pass',
  templateUrl: './modal-change-pass.component.html',
  styleUrls: ['./modal-change-pass.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalChangePassComponent implements OnInit {

  updatePass!: FormGroup;

  constructor(public modalRef: MdbModalRef<ModalChangePassComponent>,
              private fb: FormBuilder) {
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

  }

}
