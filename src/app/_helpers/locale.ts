import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import {LOCALE_ID} from '@angular/core';
registerLocaleData(es);

/**
 * Encapsula el provider de la localización
 */
export const LocalizationSpanish = [
  {provide: LOCALE_ID, useValue: 'es-*'}
];
