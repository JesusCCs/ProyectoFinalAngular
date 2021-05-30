import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/es';

const CUSTOM_FORMAT = {
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'DD MM YYYY',
  },
};

export const DateLocalizationProvider = [
  {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
  {provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMAT},
  {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  }
];
