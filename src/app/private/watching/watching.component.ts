import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, switchMap } from 'rxjs';
import { WatchingService } from './watching.service';
import { PlaybackProgressItem } from '../../shared/models/trakt.model';
import { PosterComponent } from '../../shared/components/poster/poster.component';
import { modaleConferma } from '../../shared/components/modali/modale-conferma/modale-conferma.component';

@Component({
	selector: 'app-watching',
	imports: [DatePipe, FormsModule, PosterComponent],
	templateUrl: './watching.component.html',
	styles: `
        .progress {
            height: 10px;
            border-radius: 5px;
        }
	`,
})
export class WatchingComponent {
	private watchingService = inject(WatchingService);
	private modalService = inject(NgbModal);

	// State signals
	// 'episodes' corresponds to "TV Shows", 'movies' to "Movies"
	contentType = signal<'episodes' | 'movies'>('episodes');
	refreshSignal = signal(0);

	// Data source
	rawWatchingContent = toSignal(
		combineLatest([toObservable(this.contentType), toObservable(this.refreshSignal)]).pipe(
			switchMap(([type]) => this.watchingService.getWatchingContent(type)),
		),
		{ initialValue: [] },
	);

	// UI signals
	searchTerm = signal('');
	sortColumn = signal<string>('paused_at');
	sortDirection = signal<'asc' | 'desc'>('desc');
	selectedContent = signal<Set<number>>(new Set());
	isProcessing = signal(false);

	constructor() {
		toObservable(this.contentType).subscribe(() => {
			this.selectedContent.set(new Set());
			this.sortColumn.set('paused_at');
			this.sortDirection.set('desc');
		});
	}

	// Helper functions
	getItemTitle(item: PlaybackProgressItem): string {
		// If episode, show Show Title
		return item.show?.title || item.movie?.title || '';
	}

	getItemSubtitle(item: PlaybackProgressItem): string {
		// If episode, show S01E01 - Title
		if (item.type === 'episode' && item.episode) {
			const s = item.episode.season.toString().padStart(2, '0');
			const e = item.episode.number.toString().padStart(2, '0');
			return `S${s}E${e} - ${item.episode.title}`;
		}
		return '';
	}

	getItemYear(item: PlaybackProgressItem): number {
		return item.show?.year || item.movie?.year || 0;
	}

	// Returns the playback ID for operations
	getItemPlaybackId(item: PlaybackProgressItem): number {
		return item.id;
	}

	getItemTmdbId(item: PlaybackProgressItem): number | undefined {
		return item.show?.ids.tmdb || item.movie?.ids.tmdb;
	}

	getProgress(item: PlaybackProgressItem): number {
		return Math.round(item.progress);
	}

	getRuntime(item: PlaybackProgressItem): number {
		return item.movie?.runtime || item.episode?.runtime || 0;
	}

	getWatchedTime(item: PlaybackProgressItem): string {
		const runtime = this.getRuntime(item);
		const watched = runtime * (item.progress / 100);
		return this.formatTime(watched);
	}

	getRemainingTime(item: PlaybackProgressItem): string {
		const runtime = this.getRuntime(item);
		const remaining = runtime * (1 - item.progress / 100);
		return this.formatTime(remaining);
	}

	getTotalTime(item: PlaybackProgressItem): string {
		return this.formatTime(this.getRuntime(item));
	}

	private formatTime(minutes: number): string {
		if (!minutes) return '? min';
		return Math.round(minutes) + ' min';
	}

	// Computed properties
	filteredContent = computed(() => {
		let filtered = this.rawWatchingContent() || [];

		if (this.searchTerm().trim() !== '') {
			const term = this.searchTerm().toLowerCase();
			filtered = filtered.filter(
				(item) =>
					this.getItemTitle(item).toLowerCase().includes(term) ||
					this.getItemSubtitle(item).toLowerCase().includes(term) ||
					this.getItemYear(item).toString().includes(term),
			);
		}
		return filtered;
	});

	sortedContent = computed(() => {
		const content = [...this.filteredContent()];
		const column = this.sortColumn();
		const direction = this.sortDirection();

		return content.sort((a, b) => {
			let res = 0;
			if (column === 'title') {
				res = this.getItemTitle(a).localeCompare(this.getItemTitle(b));
			} else if (column === 'year') {
				res = this.getItemYear(a) - this.getItemYear(b);
			} else if (column === 'progress') {
				res = a.progress - b.progress;
			} else if (column === 'paused_at') {
				res = new Date(a.paused_at).getTime() - new Date(b.paused_at).getTime();
			}

			return direction === 'asc' ? res : -res;
		});
	});

	onSort(column: string) {
		if (this.sortColumn() === column) {
			this.toggleSortDirection();
		} else {
			this.sortColumn.set(column);
			this.sortDirection.set('asc');
		}
	}

	toggleSortDirection() {
		this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
	}

	toggleSelection(id: number) {
		this.selectedContent.update((set) => {
			const newSet = new Set(set);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	}

	async removeProgress() {
		if (this.selectedContent().size === 0) return;

		const confirmed = await modaleConferma(
			this.modalService,
			'Warning',
			'Are you sure you want to remove the watching progress for the selected items?\nThis will clear the resume point.',
			'Remove',
			'btn-danger',
		);

		if (confirmed) {
			this.isProcessing.set(true);
			// We need to iterate as Trakt Playback delete API is one by one usually?
			// "DELETE /sync/playback/{id}" takes one ID.
			// I need to do it in parallel or sequence.

			const promises = Array.from(this.selectedContent()).map((id) => this.watchingService.removePlayback(id).toPromise());

			try {
				await Promise.all(promises);
				this.selectedContent.set(new Set());
				this.refreshSignal.update((v) => v + 1);
			} catch (err) {
				console.error('Error removing playback', err);
			} finally {
				this.isProcessing.set(false);
			}
		}
	}
}
