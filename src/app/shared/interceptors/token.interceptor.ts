import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigService } from '../services/config.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
	const token = localStorage.getItem('token');
	const configService = inject(ConfigService);

	if (token && configService.configuration && req.url.startsWith(configService.configuration.traktBaseUrl)) {
		// Autenticazione in header
		const headers = new HttpHeaders({
			Authorization: `Bearer ${token}`,
			'trakt-api-key': configService.configuration.traktClientId,
			'trakt-api-version': '2',
		});
		req = req.clone({ headers });
	}

	return next(req);
};
