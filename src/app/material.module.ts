import { NgModule } from '@angular/core';

import { MatStepperModule } from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  exports: [
    MatStepperModule,
    MatIconModule
  ]
})
export class MaterialModule {}
