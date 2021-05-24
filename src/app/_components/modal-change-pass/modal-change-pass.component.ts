import {Component, OnInit} from '@angular/core';
import {MdbModalRef} from 'mdb-angular-ui-kit';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidatorsExtension} from '../../_helpers/validators-extension';

@Component({
  selector: 'app-modal-change-pass',
  templateUrl: './modal-change-pass.component.html',
  styleUrls: ['./modal-change-pass.component.scss']
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
      updateOn: 'change'
    });
  }

  public async onSubmit(): Promise<void> {

  }

}
