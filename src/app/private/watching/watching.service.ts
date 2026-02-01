import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PlaybackProgressItem } from '../../shared/models/trakt.model';
import { ConfigService } from '../../shared/services/config.service';

@Injectable({ providedIn: 'root' })
export class WatchingService {
	private http = inject(HttpClient);
	private config = inject(ConfigService);

	getWatchingContent(type: 'movies' | 'episodes') {
		return this.http.get<PlaybackProgressItem[]>(`${this.config.configuration.traktBaseUrl}/sync/playback/${type}?extended=full`);
	}

	removePlayback(id: number) {
		return this.http.delete(`${this.config.configuration.traktBaseUrl}/sync/playback/${id}`);
	}
}
