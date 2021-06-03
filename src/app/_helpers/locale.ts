import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import {LOCALE_ID} from '@angular/core';
registerLocaleData(es);

export const LocalizationSpanish = [
  {provide: LOCALE_ID, useValue: 'es-*'}
];
