import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        host: 'localhost',
        port: 5173,
        strictPort: true,
        watch: {
            ignored: ['**/public/myassets/**'],
            // Docker on Windows does not notify Vite when a file is saved.
            usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
        },
    },
});
