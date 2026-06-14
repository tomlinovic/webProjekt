<x-layout>

    <div class="container">

        <div class="page-header">
            <h1>Anime</h1>
            <div class="search-wrapper">
                <svg width="18" height="18" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                    id="search-input"
                    type="text"
                    placeholder="Pretraži anime..."
                    autocomplete="off"
                >
            </div>
        </div>

        <p id="search-status"></p>

        <div id="random-anime" class="anime-grid"></div>

    </div>

    @vite(['resources/css/welcome.css', 'resources/js/welcome.js'])

</x-layout>