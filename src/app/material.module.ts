import { NgModule } from '@angular/core';

import { MatStepperModule } from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  exports: [
    MatStepperModule,
    MatIconModule,
    MatInputModule,
    MatMomentDateModule
  ]
})
export class MaterialModule {}
