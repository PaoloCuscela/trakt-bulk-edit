import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private configService = inject(ConfigService);

	constructor(
		private http: HttpClient,
		private router: Router,
	) {}

	get isAuthenticated() {
		const token = localStorage.getItem('token');
		return !!token;
	}

	loginWithTrakt() {
		const config = this.configService.configuration;
		const url = `https://trakt.tv/oauth/authorize?response_type=code&client_id=${config.traktClientId}&redirect_uri=${config.traktRedirectUrl}`;
		window.location.href = url;
	}

	exchangeCodeForToken(code: string) {
		const config = this.configService.configuration;
		return this.http
			.post(`${config.traktBaseUrl}/oauth/token`, {
				code,
				client_id: config.traktClientId,
				client_secret: config.traktClientSecret,
				redirect_uri: config.traktRedirectUrl,
				grant_type: 'authorization_code',
			})
			.pipe(
				tap((res: any) => {
					localStorage.setItem('token', res.access_token);
				}),
			);
	}

	logout() {
		localStorage.clear();
		sessionStorage.clear();
		this.router.navigate(['/public/login']);
	}

	checkToken() {
		return this.http.get('/api/check-token');
	}
}
