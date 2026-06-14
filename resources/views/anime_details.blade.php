<x-layout>

<meta name="csrf-token" content="{{ csrf_token() }}">

<div class="container">
    <div id="anime-details" class="anime-details">
        <div class="anime-cover">
            <img id="cover-image" src="/placeholder.jpg" alt="Loading...">
        </div>

        <div class="anime-info">
            <h1 id="anime-title">Loading...</h1>

            <div id="anime-status" class="status">
                Loading...
            </div>

            <div class="anime-stats">
                <div class="stat">
                    <div class="stat-value" id="anime-episodes">?</div>
                    <div class="stat-label">Episodes</div>
                </div>
                <div class="stat">
                    <div class="stat-value" id="anime-score">N/A</div>
                    <div class="stat-label">Rating</div>
                </div>
            </div>

            <div class="description">
                <strong>Opis:</strong>
                <p id="anime-description">Loading...</p>
            </div>

            @if(Auth::check())
            <div class="user-status-section">
                <h2>Your Status</h2>

                <!-- NEW SELECT DROPDOWN -->
                <select id="status-select" class="status-select">
                    <option value="watching">Watching</option>
                    <option value="watched">Watched</option>
                    <option value="dropped">Dropped</option>
                </select>

                <!-- BADGE THAT UPDATES -->
                <div id="user-anime-status" class="user-status-badge status-none">
                    Not watched
                </div>
            </div>
            @endif

            <div class="episodes-section">
                <h2>Episodes</h2>
                <div id="episode-list" class="episode-grid"></div>
            </div>

        </div>
    </div>
</div>

@vite(['resources/css/anime_details.css', 'resources/js/anime_details.js'])

</x-layout>
