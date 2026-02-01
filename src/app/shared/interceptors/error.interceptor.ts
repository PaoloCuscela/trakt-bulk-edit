import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

import { _ } from '@ngx-translate/core';
import { modaleAvviso } from '../components/modali/modale-avviso/modale-avviso.component';
import { modaleErrore } from '../components/modali/modale-errore/modale-errore.component';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const modalService = inject(NgbModal);
	return next(req).pipe(
		catchError((error: any) => {
			if (error instanceof HttpErrorResponse) {
				switch (error.status) {
					/* Sessione scaduta o login fallito */
					case 401:
						if (authService.isAuthenticated) {
							modaleAvviso(modalService, 'Warning', 'Session Expired');
							authService.logout();
						} else {
							modaleAvviso(modalService, 'Warning', 'Invalid Credentials');
						}
						break;
					/* Errore con messaggio gestito dal BackEnd */
					case 409:
						modaleAvviso(modalService, 'Warning', error.error?.message || error.error || 'Generic Error');
						break;
					/* Accesso ad una risorsa non consentito dai permessi dell' utente */
					case 403:
						modaleAvviso(modalService, 'Warning', 'Permission Denied');
						break;
					case 404:
						break;
					default:
						modaleErrore(modalService, 'Error', error.error?.message || error.error, error);
						break;
				}
			}
			return throwError(error);
		}),
	);
};
