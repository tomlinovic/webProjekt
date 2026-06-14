<x-layout>

    <div class="container">
        <h1>My Anime</h1>

        <div id="watching-section" class="anime-section">
            <h2>Watching</h2>
            <div class="anime-grid" id="watching-grid"></div>
        </div>

        <div id="watched-section" class="anime-section">
            <h2>Watched</h2>
            <div class="anime-grid" id="watched-grid"></div>
        </div>

        <div id="dropped-section" class="anime-section">
            <h2>Dropped</h2>
            <div class="anime-grid" id="dropped-grid"></div>
        </div>
    </div>

    @vite(['resources/css/my_anime.css', 'resources/js/my_anime.js'])

</x-layout>
