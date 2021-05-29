import {AfterViewInit, Component, OnInit, TemplateRef, ViewChildren, ViewEncapsulation} from '@angular/core';
import {MdbModalRef} from 'mdb-angular-ui-kit';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import {STEPPER_GLOBAL_OPTIONS, StepperOrientation} from '@angular/cdk/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Template} from "@angular/compiler/src/render3/r3_ast";

@Component({
  selector: 'app-modal-new-ad',
  templateUrl: './modal-new-ad.component.html',
  styleUrls: ['./modal-new-ad.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }],
})
export class ModalNewAdComponent implements OnInit, AfterViewInit {

  stepperOrientation: Observable<StepperOrientation>;

  fileForm!: FormGroup;
  input!: HTMLInputElement;

  detailsForm!: FormGroup;
  doneForm!: FormGroup;

  loading = false;
  finished = false;

  constructor(public modalRef: MdbModalRef<ModalNewAdComponent>,
              private fb: FormBuilder,
              private breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'));
  }


  ngOnInit(): void {
    this.fileForm = this.fb.group({
      recurso: [null, Validators.required]
    }, {updateOn: 'submit'});

    this.detailsForm = this.fb.group({});

    this.doneForm = this.fb.group({});
  }

  ngAfterViewInit(): void {
    this.input = document.getElementById('upload-input') as HTMLInputElement;
  }

  uploadFile(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files === null) {
      return;
    }

    const file = files[0];

    this.input.value = file.name;
    this.loading = true;
  }

  clickUpload(): void {
    document.getElementById('recurso')?.click();
  }

  checkValidity(event: MouseEvent): void {
    if (this.fileForm.invalid) {
      this.fileForm.markAllAsTouched();
      return;
    }
  }
}
