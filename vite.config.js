import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/css/register.css',
                'resources/js/register.js',
                'resources/css/anime_details.css',
                'resources/js/anime_details.js',
                'resources/css/comments_page.css',
                'resources/js/comments_page.js',
                'resources/css/friends.css',
                'resources/js/friends.js',
                'resources/css/my_anime.css',
                'resources/js/my_anime.js',
                'resources/css/welcome.css',
                'resources/js/welcome.js',
                'resources/css/literatura.css',
                'resources/js/login.js'
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
