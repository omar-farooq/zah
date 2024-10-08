import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        https: false,
        host: true,
        port: 3000,
        hmr: {host: 'localhost', protocol: 'ws'},
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        NodeGlobalsPolyfillPlugin({
            buffer: true
        }),
    ],
    define: {
        global: 'globalThis',
    },
});
