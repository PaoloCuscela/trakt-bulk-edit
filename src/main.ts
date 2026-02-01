import { provideZoneChangeDetection } from '@angular/core';
/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideSignalFormsConfig } from '@angular/forms/signals';
import { NG_STATUS_CLASSES } from '@angular/forms/signals/compat';

bootstrapApplication(AppComponent, {
	...appConfig,
	providers: [
		provideZoneChangeDetection(),
		provideSignalFormsConfig({
			classes: NG_STATUS_CLASSES,
		}),
		...appConfig.providers,
	],
}).catch((err) => console.error(err));
