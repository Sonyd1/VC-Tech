import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			external: ['@prisma/client']
		}
	},
	plugins: [sveltekit()]
	
});
