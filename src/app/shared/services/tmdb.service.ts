import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TmdbService {
	private http = inject(HttpClient);
	private configService = inject(ConfigService);
	private cache = new Map<string, string | null>();

	getPosterUrl(tmdbId: number, type: 'shows' | 'movies' = 'shows'): Observable<string | null> {
		if (!tmdbId) return of(null);
		const cacheKey = `${type}-${tmdbId}`;

		if (this.cache.has(cacheKey)) {
			return of(this.cache.get(cacheKey)!);
		}

		const apiKey = this.configService.configuration.tmdbApiKey;
		if (!apiKey) {
			return of(null);
		}

		const endpoint = type === 'shows' ? 'tv' : 'movie';
		return this.http.get<any>(`${this.configService.configuration.tmdbBaseUrl}/${endpoint}/${tmdbId}?api_key=${apiKey}`).pipe(
			map((res) => {
				if (res.poster_path) {
					const url = `https://image.tmdb.org/t/p/w92${res.poster_path}`;
					this.cache.set(cacheKey, url);
					return url;
				}
				this.cache.set(cacheKey, null);
				return null;
			}),
			tap({
				error: () => this.cache.set(cacheKey, null), // Cache failures as null to avoid retrying loop
			}),
		);
	}
}
