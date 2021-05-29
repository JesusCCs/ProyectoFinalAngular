import {Component, OnInit} from '@angular/core';
import {MdbModalRef} from 'mdb-angular-ui-kit';
import {FormBuilder, Validators} from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import {StepperOrientation} from '@angular/cdk/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-modal-new-ad',
  templateUrl: './modal-new-ad.component.html',
  styleUrls: ['./modal-new-ad.component.scss']
})
export class ModalNewAdComponent implements OnInit {

  stepperOrientation: Observable<StepperOrientation>;

  firstFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required]
  });
  secondFormGroup = this.fb.group({
    secondCtrl: ['', Validators.required]
  });
  thirdFormGroup = this.fb.group({
    thirdCtrl: ['', Validators.required]
  });

  constructor(public modalRef: MdbModalRef<ModalNewAdComponent>,
              private fb: FormBuilder,
              private breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'));
  }

  ngOnInit(): void {
  }

}
