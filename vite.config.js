import { defineConfig } from 'vite';

export default defineConfig({
    base: './', // Relative base path for GitHub Pages
    build: {
        outDir: 'docs', // Output to docs folder
        emptyOutDir: true, // Clear output directory before building
    }
});
