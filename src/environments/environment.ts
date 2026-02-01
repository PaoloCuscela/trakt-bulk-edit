import { IConfiguration } from '../app/shared/models/configuration.model';

export const environment: IConfiguration = {
	production: false,
	traktClientId: '1fc6e405eeec11856ed62f13bbf880a54cdcdf3ea82d56e08c87df2d60faf998',
	traktClientSecret: 'c81c018bc92481c04dea2795500bacd59efb708a389dc8e6a42e71ecc1531246',
	traktRedirectUrl: 'http://localhost:4200/public/login',
	tmdbApiKey: 'c31c67d63f433851d6e822ce86b17f21',
	traktBaseUrl: '/trakt-api',
	tmdbBaseUrl: '/tmdb-api',
};
