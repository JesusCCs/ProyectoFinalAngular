import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdbModalRef} from 'mdb-angular-ui-kit';

@Component({
  selector: 'app-modal-change-email',
  templateUrl: './modal-change-email.component.html',
  styleUrls: ['./modal-change-email.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalChangeEmailComponent implements OnInit {

  changeEmail!: FormGroup;

  constructor(public modalRef: MdbModalRef<ModalChangeEmailComponent>,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.changeEmail = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]],
    }, {
      updateOn: 'submit'
    });
  }

  public async onSubmit(): Promise<void> {

  }
}
