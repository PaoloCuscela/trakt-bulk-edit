export interface Ids {
	trakt: number;
	slug: string;
	tvdb: number;
	imdb: string;
	tmdb: number;
	tvrage?: any;
}

export interface Show {
	title: string;
	year: number;
	ids: Ids;
	aired_episodes?: number;
}

export interface Movie {
	title: string;
	year: number;
	ids: Ids;
}

export interface WatchedShow {
	plays: number;
	last_watched_at: string;
	last_updated_at: string;
	reset_at?: any;
	show: Show;
	seasons?: any[]; // Simplified for now
}

export interface WatchedMovie {
	plays: number;
	last_watched_at: string;
	last_updated_at: string;
	movie: Movie;
}

export type WatchedContent = {
	plays: number;
	last_watched_at: string;
	last_updated_at: string;
	show?: Show;
	movie?: Movie;
	seasons?: any[];
};

export interface Episode {
	season: number;
	number: number;
	title: string;
	ids: Ids;
	runtime: number;
}

export interface PlaybackProgressItem {
	id: number;
	progress: number;
	paused_at: string;
	type: 'episode' | 'movie';
	episode?: Episode;
	show?: Show;
	movie?: Movie & { runtime: number }; // Movie usually has runtime in extended info
}
