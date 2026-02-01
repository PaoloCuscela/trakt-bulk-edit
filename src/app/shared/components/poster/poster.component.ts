import { Component, Input, inject, signal, OnChanges, SimpleChanges } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TmdbService } from '../../services/tmdb.service';

@Component({
	selector: 'app-poster',
	imports: [NgOptimizedImage],
	template: `
        <div class="poster-container" [style.width]="fill ? '100%' : width + 'px'" [style.height]="fill ? '100%' : height + 'px'" [class.position-relative]="fill">
            @if (imageUrl(); as url) {
                @if (fill) {
                    <img [ngSrc]="url" fill [priority]="priority" alt="Poster" class="poster-img" style="object-fit: cover;" />
                } @else {
                    <img [ngSrc]="url" [width]="width" [height]="height" [priority]="priority" alt="Poster" class="poster-img shadow-sm" />
                }
            } @else {
                <div class="bg-body-secondary d-flex align-items-center justify-content-center text-muted small" 
                     [style.width]="fill ? '100%' : width + 'px'" 
                     [style.height]="fill ? '100%' : height + 'px'">
                    @if (!fill) {
                        No Img
                    }
                </div>
            }
        </div>
    `,
	styles: `
        .poster-img {
            border-radius: 0;
            object-fit: cover;
            background-color: var(--bs-secondary-bg);
        }
        :host {
            display: block;
            height: 100%;
        }
    `,
})
export class PosterComponent implements OnChanges {
	@Input() tmdbId: number | undefined;
	@Input() type: 'shows' | 'movies' = 'shows';
	@Input() width: number = 40;
	@Input() height: number = 60;
	@Input() fill: boolean = false;
	@Input() priority: boolean = false;

	tmdbService = inject(TmdbService);
	imageUrl = signal<string | null>(null);

	ngOnChanges(changes: SimpleChanges): void {
		if ((changes['tmdbId'] || changes['type']) && this.tmdbId) {
			this.tmdbService.getPosterUrl(this.tmdbId, this.type).subscribe((url) => {
				this.imageUrl.set(url);
			});
		}
	}
}
