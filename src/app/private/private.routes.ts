import { Routes } from '@angular/router';
import { PrivateComponent } from './private.component';
import { WatchedComponent } from './watched/watched.component';
import { WatchingComponent } from './watching/watching.component';

export const routes: Routes = [
	{
		path: '',
		component: PrivateComponent,
		children: [
			{ path: '', redirectTo: 'watched', pathMatch: 'full' },
			{ path: 'watched', component: WatchedComponent },
			{ path: 'watching', component: WatchingComponent },
		],
	},
];
