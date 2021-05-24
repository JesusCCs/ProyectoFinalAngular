import {Component, Input, OnInit, Optional} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {

  @Input() form!: FormGroup;
  @Input() name!: string;
  @Input() label!: string;

  @Input() @Optional() darkTheme = false;

  private _input!: AbstractControl;

  constructor() {
  }

  ngOnInit(): void {
    this._input = this.form.controls[this.name];
  }

  get errors(): any {
    return this._input.errors;
  }

  get touched(): boolean {
    return this.form.controls[this.name].touched;
  }

}
