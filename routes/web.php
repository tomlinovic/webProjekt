<?php

use App\Http\Controllers\CommentsController;
use Illuminate\Support\Facades\Route;
use App\Models\Anime;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FriendController;
use App\Models\AnimeStatuses;
use App\Models\UserAnimeProgress;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/literatura', function () {
    return view('literatura');
});
Route::get('/random-anime', function () {
    return response()->json(
        Anime::inRandomOrder()->take(12)->get()
    );
});
Route::get('/search-anime', function () {
    $query = request('q', '');

    if (empty($query)) {
        return response()->json(
            Anime::inRandomOrder()->take(12)->get()
        );
    }

    return response()->json(
        Anime::where('title', 'like', "%{$query}%")
            ->take(12)->get()
    );
});
Route::get('/anime/{id}', function ($id) {
    return view('anime_details');
});
Route::get('/anime-progress-info/{animeId}', [FriendController::class, 'progressInfo'])
    ->middleware('auth');
Route::get('/anime-json/{id}', function ($id) {
    return response()->json( Anime::findOrFail($id)
    );
});


// Register
Route::get('/register', [UserController::class, 'showRegister']);
Route::post('/register', [UserController::class, 'register']);
Route::get('/check-email', function (Illuminate\Http\Request $request) {
    return response()->json([
        'exists' => \App\Models\User::where('email', $request->email)->exists()
    ]);
});


// Login
Route::get('/login', [UserController::class, 'showLogin'])->name('login');
Route::post('/login', [UserController::class, 'login']);

// Logout
Route::post('/logout', [UserController::class, 'logout']);

Route::get('/anime-status/{anime}', function ($animeId) {
    $userId = Auth::id();

    $status = AnimeStatuses::where('user_id', $userId)
        ->where('anime_id', $animeId)
        ->value('status');

    $progress = UserAnimeProgress::where('user_id', $userId)
        ->where('anime_id', $animeId)
        ->value('episodeNumber');

    return response()->json([
        'status' => $status,
        'progress' => $progress ?? 0
    ]);
});



Route::post('/anime-status/update', function (Request $request) {

    $request->validate([
        'anime_id' => 'required|integer',
        'status' => 'required|string'
    ]);

    $userId = Auth::id();
    $animeId = $request->anime_id;

    // NORMALIZE STATUS
    $status = strtolower($request->status);



    // 1) Update or create anime status
    AnimeStatuses::updateOrCreate(
        [
            'anime_id' => $animeId,
            'user_id' => $userId
        ],
        [
            'status' => $status
        ]
    );

    // 2) Reset progress to 1 when switching to watching
    if ($status === 'watching') {
        UserAnimeProgress::updateOrCreate(
            ['user_id' => $userId, 'anime_id' => $animeId],
            ['episodeNumber' => 1]
        );
    }

    // 3) If user sets status to watched → set progress to last episode
    if ($status === 'watched') {

        $anime = Anime::find($animeId);

        if ($anime && $anime->episodes) {
            UserAnimeProgress::updateOrCreate(
                [
                    'user_id' => $userId,
                    'anime_id' => $animeId
                ],
                [
                    'episodeNumber' => $anime->episodes
                ]
            );
        }
    }

    return response()->json(['success' => true]);
});


Route::get('/my-anime', function () {
    return view('my_anime');
});
Route::get('/my-anime-json', function () {

    $statuses = AnimeStatuses::where('user_id', Auth::id())
        ->with('anime')
        ->get()
        ->groupBy('status');

    return response()->json($statuses);
});

Route::post('/anime-progress/update', function (Request $request) {

    $request->validate([
        'anime_id' => 'required|integer',
        'episode' => 'required|integer'
    ]);

    $userId = Auth::id();
    $animeId = $request->anime_id;
    $episode = $request->episode;

    // Update progress ONLY if user is watching
    $status = AnimeStatuses::where('user_id', $userId)
        ->where('anime_id', $animeId)
        ->value('status');

    if ($status !== 'watching') {
        return response()->json(['error' => 'Not allowed'], 403);
    }

    // Update or create progress
    UserAnimeProgress::updateOrCreate(
        ['user_id' => $userId, 'anime_id' => $animeId],
        ['episodeNumber' => $episode]
    );

    return response()->json(['success' => true]);
});

Route::middleware('auth')->group(function () {
    Route::get('/friends', function () {
        return view('friends'); // tvoja Blade/HTML stranica
    });

    Route::get('/friends-json', [FriendController::class, 'index']);
});

Route::middleware('auth')->get('/search-users', [UserController::class, 'search']);
Route::middleware('auth')->post('/send-friend-request', [FriendController::class, 'send']);
Route::middleware('auth')->post('/remove-friend', [FriendController::class, 'remove']);
Route::middleware('auth')->get('/friend-requests', [FriendController::class, 'requests']);
Route::middleware('auth')->post('/friend-requests/accept', [FriendController::class, 'accept']);
Route::middleware('auth')->post('/friend-requests/decline', [FriendController::class, 'decline']);

//Comments
Route::post('/comment/{id}/report', [CommentsController::class, 'report'])->middleware('auth');
Route::get('/comment/{anime_id}/{episode_number}', [CommentsController::class, 'showComments'])
    ->middleware('auth');
Route::post('/comment/{anime_id}/{episode_number}', [CommentsController::class, 'store'])
    ->middleware('auth');
Route::put('/comment/{id}', [CommentsController::class, 'update'])->name('comment.update')->middleware('auth');
Route::delete('/comment/{id}', [CommentsController::class, 'delete'])->middleware('auth');








