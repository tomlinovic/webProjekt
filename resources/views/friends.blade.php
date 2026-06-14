<x-layout>
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <h1>FRIENDS</h1>

    <input type="text" id="search" placeholder="Search by email or username">

    <div id="search-results"></div>

    <h2>Friend Requests</h2>
    <div id="friend-requests"></div>


    <h2>Your Friends</h2>
    <div id="friends-list"></div>

    @vite(['resources/css/friends.css', 'resources/js/friends.js'])

</x-layout>