import 'dotenv/config';

export const REQUIRED_ENVIRONMENT_VARIABLE_NAMES = ['WIKI_NAME', 'DATABASE_URL', 'CACHE_DATABASE_URL', 'EMAIL_USER', 'EMAIL_PASSWORD', 'JSON_WEB_TOKEN_SECRET', 'PORT', 'PASSWORD_BASED_KEY_DERIVATION_FUNCTION_ITERATION', 'DEFAULT_RATE_LIMIT', 'DEFAULT_PAGE_SIZE', 'PAGE_SIZE_LIMIT',] as const;

for(let i = 0; i < REQUIRED_ENVIRONMENT_VARIABLE_NAMES['length']; i++) {
	if(typeof(process['env'][REQUIRED_ENVIRONMENT_VARIABLE_NAMES[i]]) === 'undefined') {
		throw new Error('Unconfigured environment variable(' + REQUIRED_ENVIRONMENT_VARIABLE_NAMES[i] + ')');
	} else if(process['env'][REQUIRED_ENVIRONMENT_VARIABLE_NAMES[i]].startsWith('\'') && process['env'][REQUIRED_ENVIRONMENT_VARIABLE_NAMES[i]].endsWith('\'')) {
		process['env'][REQUIRED_ENVIRONMENT_VARIABLE_NAMES[i]] = process['env'][REQUIRED_ENVIRONMENT_VARIABLE_NAMES[i]].slice(1, -1);
	}
}

process['env']['TZ'] = 'UTC';

// @ts-expect-error
export const PORT = Number.parseInt(process['env']['PORT']) as const;

// @ts-expect-error
export const PBKDF_ITERATION = Number.parseInt(process['env']['PBKDF_ITERATION']) as const;

// @ts-expect-error
export const DEFAULT_RATE_LIMIT = Number.parseInt(process['env']['DEFAULT_RATE_LIMIT']) as const;

// @ts-expect-error
export const DEFAULT_PAGE_SIZE = Number.parseInt(process['env']['DEFAULT_PAGE_SIZE']) as const;

// @ts-expect-error
export const PAGE_SIZE_LIMIT = Number.parseInt(process['env']['PAGE_SIZE_LIMIT']) as const;

export const IS_PRODUCTION_ENVIRONMENT = __filename.endsWith('.js') && process['env']['NODE_ENV'] === 'production' as const;