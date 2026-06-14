<x-layout>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <div class="comments-wrapper">

        <h1 class="title">{{ $anime->title }} — Episode {{ $episode }} comments</h1>
        <div id="report-message" class="report-message"></div>

        <div class="filter-buttons">
            <button id="filter-friends" class="filter-btn active">Friends</button>
            <button id="filter-everyone" class="filter-btn">Everyone</button>
        </div>

        <div class="new-comment-box">
            <textarea id="comment-input" placeholder="Write a comment..."></textarea>
            <button id="submit-comment">Post Comment</button>
        </div>

        <div id="comments-container" class="comments-container"></div>

    </div>

    <script>
        window.AppData = {
            friendComments: @json($friendCommentsJson),
            allComments: @json($allCommentsJson),
            userId: {{ auth()->id() }},
            userName: @json(auth()->user()->name),
            animeId: {{ $anime->id }},
            episode: {{ $episode }},
            csrf: @json(csrf_token())
        };
    </script>

    @vite(['resources/css/comments_page.css', 'resources/js/comments_page.js'])


</x-layout>
