import { IConfiguration } from '../app/shared/models/configuration.model';

export const environment: IConfiguration = {
	production: true,
	traktClientId: '',
	traktClientSecret: '',
	traktRedirectUrl: 'https://paolocuscela.github.io/trakt-bulk-edit/public/login',
	tmdbApiKey: '',
	traktBaseUrl: 'https://api.trakt.tv',
	tmdbBaseUrl: 'https://api.themoviedb.org/3',
};
