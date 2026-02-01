import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClient, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';

import { tokenInterceptor } from './shared/interceptors/token.interceptor';
import { httpLogInterceptor } from './shared/interceptors/http-log.interceptor';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { ConfigService } from './shared/services/config.service';

export function configServiceFactory(configService: ConfigService) {
	return () => configService.load();
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideHttpClient(withInterceptors([tokenInterceptor, httpLogInterceptor, errorInterceptor])),
		provideAppInitializer(() => {
			const initializerFn = configServiceFactory(inject(ConfigService));
			return initializerFn();
		}),
	],
};
