import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
	selector: 'app-private',
	imports: [RouterOutlet, RouterLink, RouterLinkActive],
	template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Trakt Bulk Edit</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0  gap-2">
            <li class="nav-item">
              <a class="nav-link" routerLink="watched" routerLinkActive="active">Watched</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="watching" routerLinkActive="active">Watching</a>
            </li>
          </ul>
          <div class="d-flex align-items-center">
             <a href="https://github.com/PaoloCuscela/trackt-bulk-edit" target="_blank" class="text-white me-3 fs-4" title="GitHub Repository">
                <i class="bi bi-github"></i>
             </a>
             <button class="btn btn-outline-light" (click)="authService.logout()">Logout</button>
          </div>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
	styles: ``,
})
export class PrivateComponent {
	authService = inject(AuthService);
}
