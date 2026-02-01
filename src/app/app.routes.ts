import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
	{
		path: 'public',
		loadChildren: () => import('./public/public.routes').then((r) => r.routes),
	},
	{
		path: '',
		canActivate: [AuthGuard],
		loadChildren: () => import('./private/private.routes').then((r) => r.routes),
	},

	{ path: '**', redirectTo: '/public/404' },
];
