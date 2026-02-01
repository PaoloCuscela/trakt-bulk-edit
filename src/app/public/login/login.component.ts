import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-login',
	imports: [FormsModule],
	templateUrl: './login.component.html',
	styles: ``,
})
export class LoginComponent implements OnInit {
	router = inject(Router);
	route = inject(ActivatedRoute);
	authService = inject(AuthService);

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			const code = params['code'];
			if (code) {
				this.authService.exchangeCodeForToken(code).subscribe({
					next: () => {
						this.router.navigate(['/']);
					},
					error: (err) => {
						console.error('Login call returned error', err);
					},
				});
			}
		});
	}

	login() {
		this.authService.loginWithTrakt();
	}
}
