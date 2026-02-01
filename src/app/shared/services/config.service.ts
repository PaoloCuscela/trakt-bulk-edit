import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IConfiguration } from '../models/configuration.model';

@Injectable({ providedIn: 'root' })
export class ConfigService {
	protected _configuration!: IConfiguration;

	constructor() {}

	get configuration(): IConfiguration {
		return this._configuration;
	}

	load() {
		this._configuration = environment;
		return of(true);
	}
}
