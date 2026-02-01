import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Pagina404Component } from './pagina404/pagina404.component';
import { PublicComponent } from './public.component';

export const routes: Routes = [
	{
		path: '',
		component: PublicComponent,
		children: [
			{ path: 'login', component: LoginComponent },
			{ path: '404', component: Pagina404Component },
		],
	},
];
