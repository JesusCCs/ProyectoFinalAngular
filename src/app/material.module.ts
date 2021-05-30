import { NgModule } from '@angular/core';

import { MatStepperModule } from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
  exports: [
    MatStepperModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule
  ]
})
export class MaterialModule {}
