declare module 'astro:env/server' {
	export const SUPABASE_URL: string | undefined;	
	export const SUPABASE_KEY: string | undefined;	
	export const OPENROUTER_API_KEY: string;	
	export const OPENROUTER_MODEL: string;	
	export const OPENROUTER_HTTP_REFERER: string | undefined;	
}