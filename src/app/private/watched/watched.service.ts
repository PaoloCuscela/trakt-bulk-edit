import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { ConfigService } from '../../shared/services/config.service';
import { PlaybackProgressItem, WatchedContent } from '../../shared/models/trakt.model';

@Injectable({ providedIn: 'root' })
export class WatchedService {
	constructor(
		private http: HttpClient,
		private config: ConfigService,
	) {}

	getWatchedContent(type: 'movies' | 'shows') {
		return this.http.get<WatchedContent[]>(`${this.config.configuration.traktBaseUrl}/sync/watched/${type}?extended=full`);
	}

	removeFromHistory(ids: number[], type: 'movies' | 'shows') {
		const body = {
			[type]: ids.map((id) => ({ ids: { trakt: id } })),
		};

		const historyRemove$ = this.http.post(`${this.config.configuration.traktBaseUrl}/sync/history/remove`, body);
		const playbackRemove$ = this.removePlayback(ids, type);

		return forkJoin([historyRemove$, playbackRemove$]);
	}

	private removePlayback(ids: number[], type: 'movies' | 'shows') {
		const playbackType = type === 'shows' ? 'episodes' : 'movies';
		return this.http
			.get<PlaybackProgressItem[]>(`${this.config.configuration.traktBaseUrl}/sync/playback/${playbackType}?extended=full`)
			.pipe(
				switchMap((items) => {
					const toRemove = items.filter((item) => {
						// For shows, check item.show.ids.trakt
						// For movies, check item.movie.ids.trakt
						const itemId = type === 'shows' ? item.show?.ids.trakt : item.movie?.ids.trakt;
						return itemId && ids.includes(itemId);
					});

					if (toRemove.length === 0) return of(null);

					const deleteReqs = toRemove.map((item) => this.http.delete(`${this.config.configuration.traktBaseUrl}/sync/playback/${item.id}`));
					return forkJoin(deleteReqs);
				}),
			);
	}

	addToHistory(ids: number[], type: 'movies' | 'shows') {
		const body = {
			[type]: ids.map((id) => ({ ids: { trakt: id } })),
		};
		return this.http.post(`${this.config.configuration.traktBaseUrl}/sync/history`, body);
	}
}
