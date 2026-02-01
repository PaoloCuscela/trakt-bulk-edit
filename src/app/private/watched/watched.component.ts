import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, switchMap } from 'rxjs';
import { WatchedService } from './watched.service';
import { WatchedContent } from '../../shared/models/trakt.model';
import { PosterComponent } from '../../shared/components/poster/poster.component';
import { modaleConferma } from '../../shared/components/modali/modale-conferma/modale-conferma.component';

@Component({
	selector: 'app-watched',
	imports: [DatePipe, FormsModule, PosterComponent],
	templateUrl: './watched.component.html',
	styles: `
        .progress {
            height: 10px;
            border-radius: 5px;
        }
	`,
})
export class WatchedComponent {
	private watchedService = inject(WatchedService);
	private modalService = inject(NgbModal);

	// State signals
	contentType = signal<'shows' | 'movies'>('shows');
	refreshSignal = signal(0);

	// Data source
	rawWatchedContent = toSignal(
		combineLatest([toObservable(this.contentType), toObservable(this.refreshSignal)]).pipe(
			switchMap(([type]) => this.watchedService.getWatchedContent(type)),
		),
		{ initialValue: [] },
	);

	// UI signals
	searchTerm = signal('');
	completionFilter = signal<'all' | 'completed' | 'not-completed'>('all');
	sortColumn = signal<string>('last_watched_at');
	sortDirection = signal<'asc' | 'desc'>('desc');
	selectedContent = signal<Set<number>>(new Set());
	isProcessing = signal(false);

	// Filter Reset when switching content type
	constructor() {
		toObservable(this.contentType).subscribe(() => {
			this.selectedContent.set(new Set());
			this.sortColumn.set('last_watched_at');
			this.sortDirection.set('desc');
			this.completionFilter.set('all');
		});
	}

	// Helper functions
	getItemTitle(item: WatchedContent): string {
		return item.show?.title || item.movie?.title || '';
	}

	getItemYear(item: WatchedContent): number {
		return item.show?.year || item.movie?.year || 0;
	}

	getItemTraktId(item: WatchedContent): number {
		return item.show?.ids.trakt || item.movie?.ids.trakt || 0;
	}

	getItemTmdbId(item: WatchedContent): number | undefined {
		return item.show?.ids.tmdb || item.movie?.ids.tmdb;
	}

	getItemAiredEpisodes(item: WatchedContent): number {
		return item.show?.aired_episodes || 0;
	}

	getWatchedEpisodeCount(item: WatchedContent): number {
		if (!item.seasons) return 0;
		let count = 0;
		for (const season of item.seasons) {
			if (season.episodes) {
				count += season.episodes.length;
			}
		}
		return count;
	}

	getCompletionPercentage(item: WatchedContent): number {
		if (this.contentType() === 'movies') return 100;

		const aired = item.show?.aired_episodes || 0;
		if (aired === 0) return 0;
		const watched = this.getWatchedEpisodeCount(item);
		return Math.min(100, Math.round((watched / aired) * 100));
	}

	// Computed properties
	filteredContent = computed(() => {
		const filter = this.completionFilter();
		const content = this.rawWatchedContent() || [];

		let filtered = content;

		if (this.searchTerm().trim() !== '') {
			const term = this.searchTerm().toLowerCase();
			filtered = filtered.filter(
				(item) => this.getItemTitle(item).toLowerCase().includes(term) || this.getItemYear(item).toString().includes(term),
			);
		}

		if (filter !== 'all' && this.contentType() === 'shows') {
			filtered = filtered.filter((item) => {
				const percentage = this.getCompletionPercentage(item);
				return filter === 'completed' ? percentage === 100 : percentage < 100;
			});
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
			} else if (column === 'completion') {
				const completionA = this.getCompletionPercentage(a);
				const completionB = this.getCompletionPercentage(b);
				res = completionA - completionB;
			} else if (column === 'last_watched_at') {
				res = new Date(a.last_watched_at).getTime() - new Date(b.last_watched_at).getTime();
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

	async resetProgress() {
		if (this.selectedContent().size === 0) return;

		const confirmed = await modaleConferma(
			this.modalService,
			'Warning',
			'Are you sure you want to reset the progress for the selected items?\nThis operation will remove all plays from Trakt history.',
			'Reset all',
			'btn-danger',
		);

		if (confirmed) {
			this.isProcessing.set(true);
			const ids = Array.from(this.selectedContent());
			this.watchedService.removeFromHistory(ids, this.contentType()).subscribe({
				next: () => {
					this.selectedContent.set(new Set());
					this.refreshSignal.update((v) => v + 1);
					this.isProcessing.set(false);
				},
				error: (err) => {
					console.error('Error resetting progress', err);
					this.isProcessing.set(false);
				},
			});
		}
	}

	async markAsCompleted() {
		if (this.selectedContent().size === 0) return;

		const confirmed = await modaleConferma(
			this.modalService,
			'Confirm',
			'Are you sure you want to mark the selected items as completed?\nFor shows, this will mark all episodes as completed.',
			'Mark as Completed',
			'btn-primary',
		);

		if (confirmed) {
			this.isProcessing.set(true);
			const ids = Array.from(this.selectedContent());
			this.watchedService.addToHistory(ids, this.contentType()).subscribe({
				next: () => {
					this.selectedContent.set(new Set());
					this.refreshSignal.update((v) => v + 1);
					this.isProcessing.set(false);
				},
				error: (err) => {
					console.error('Error marking as completed', err);
					this.isProcessing.set(false);
				},
			});
		}
	}
}
