import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LogService {
	constructor(private http: HttpClient) {
		const debug = console.debug;
		const stylesDebug = `background: CornflowerBlue; border-radius: 3px; color: white; font-weight: bold; padding: 2px 5px`;
		console.debug = (...args) => debug('%c' + this.timestamp, stylesDebug, ...args);

		const log = console.log;
		const stylesLog = `background: green; border-radius: 3px; color: white; font-weight: bold; padding: 2px 5px`;
		console.log = (...args) => log('%c' + this.timestamp, stylesLog, ...args);

		const warn = console.warn.bind(console);
		const stylesWarn = `background: gold; border-radius: 3px; color: white; font-weight: bold; padding: 2px 5px`;
		console.warn = (...args) => warn('%c' + this.timestamp, stylesWarn, ...args);
	}

	get timestamp() {
		return new DatePipe('en-US').transform(new Date(), 'HH:mm:ss');
	}

	set logToServerAbilitato(value: boolean) {
		if (value) {
			const error = console.error.bind(console);
			const stylesError = `background: red; border-radius: 3px; color: white; font-weight: bold; padding: 2px 5px`;
			console.error = (...args) => {
				error('%c' + this.timestamp, stylesError, ...args);
				this.logToServer(...args);
			};
		}
	}

	logToServer(...args: any) {
		// Controllo che tra gli argomenti non ci sia un HttpErrorResponse
		if (args.some((arg: any) => arg instanceof HttpErrorResponse)) {
			return;
		}
		const messages = args.map((arg: any) => (typeof arg === 'string' ? arg : JSON.stringify(arg)));
		const href = window.location.href;
		this.http.post('/api/log', { messages, href }).subscribe();
	}
}
