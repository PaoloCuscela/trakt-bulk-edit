import { HttpResponse, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

/**
 *
 * Logga le richieste HTTP e le risposte ricevute nella console del browser ( Abilitare il livello debug nella console per visualizzare i log )
 */
export const httpLogInterceptor: HttpInterceptorFn = (req, next) => {
	return next(req).pipe(
		tap((event: any) => {
			if (req.url.includes('i18n')) {
				return;
			}
			if (event instanceof HttpResponse) {
				/* gestione della response */
				console.debug(`${req.method} -`, req.url, `- ${event.status} ${event.body == null ? '(body della response null)' : ''}`);
				if (req.method === 'POST') {
					console.debug('BODY: ', req.body);
				}
				if (event.body) {
					console.debug(event.body);
				}
			}
		}),
	);
};
