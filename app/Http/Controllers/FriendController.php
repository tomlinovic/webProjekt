<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\FriendRequest;
use App\Models\User;
use App\Models\UserAnimeProgress;
use Illuminate\Http\Request;

class FriendController extends Controller
{
    //
    public function index()
    {
        $user = Auth::user();

        $friends = FriendRequest::where('status', 1) // 1 = approved
            ->where(function ($q) use ($user) {
                $q->where('friend1', $user->id)
                ->orWhere('friend2', $user->id);
            })
            ->with(['friend1User', 'friend2User'])
            ->get();

        return response()->json([
                                'user_id' => Auth::id(),
                                'friends' => $friends
        ]);
    }

    public function send(Request $request)
    {
        $sender = Auth::id();
        $receiver = $request->input('receiver_id');

        // Ne možeš sam sebi poslati
        if ($sender == $receiver) {
            return response()->json(['error' => 'Cannot add yourself'], 400);
        }

        // Provjeri postoji li već zahtjev
        $exists = FriendRequest::where(function ($q) use ($sender, $receiver) {
            $q->where('friend1', $sender)->where('friend2', $receiver);
        })->orWhere(function ($q) use ($sender, $receiver) {
            $q->where('friend1', $receiver)->where('friend2', $sender);
        })->first();

        if ($exists) {
            return response()->json(['error' => 'Request already exists'], 400);
        }

        FriendRequest::create([
            'friend1' => $sender,
            'friend2' => $receiver,
            'status' => 0 // pending
        ]);

        return response()->json(['success' => true]);
    }

    public function requests()
    {
        $userId = Auth::id();

        $requests = FriendRequest::where('friend2', $userId)
            ->where('status', 0) // pending
            ->with('sender')     // sender = relation to User
            ->get();

        return response()->json($requests);
    }

    public function accept(Request $request)
    {
        $req = FriendRequest::find($request->id);

        if (!$req) return response()->json(['error' => 'Not found'], 404);

        $req->status = 1;
        $req->save();

        return response()->json(['success' => true]);
    }

    public function decline(Request $request)
    {
        $req = FriendRequest::find($request->id);

        if (!$req) return response()->json(['error' => 'Not found'], 404);

        $req->delete();

        return response()->json(['success' => true]);
    }

    public function remove(Request $request)
    {
        $userId = Auth::id();
        $friendId = $request->friend_id;

        // pronađi friend request koji ih povezuje
        $req = FriendRequest::where(function ($q) use ($userId, $friendId) {
            $q->where('friend1', $userId)->where('friend2', $friendId);
        })->orWhere(function ($q) use ($userId, $friendId) {
            $q->where('friend1', $friendId)->where('friend2', $userId);
        })->first();

        if (!$req) {
            return response()->json(['error' => 'Not friends'], 404);
        }

        $req->delete();

        return response()->json(['success' => true]);
    }


    public function progressInfo($animeId)
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        /*
        |--------------------------------------------------------------------------
        | MY PROGRESS
        |--------------------------------------------------------------------------
        */

        $myProgress = UserAnimeProgress::where('user_id', $userId)
            ->where('anime_id', $animeId)
            ->value('episodeNumber') ?? 0;

        /*
        |--------------------------------------------------------------------------
        | FRIENDS
        |--------------------------------------------------------------------------
        */

        $friends = FriendRequest::where(function ($q) use ($userId) {
                $q->where('friend1', $userId)
                ->orWhere('friend2', $userId);
            })
            ->where('status', 1)
            ->get();

        $messages = [];

        foreach ($friends as $f) {

            $friendId =
                $f->friend1 == $userId
                    ? $f->friend2
                    : $f->friend1;

            /*
            |--------------------------------------------------------------------------
            | FRIEND PROGRESS
            |--------------------------------------------------------------------------
            */

            $friendProgressRecord = UserAnimeProgress::where('user_id', $friendId)
                ->where('anime_id', $animeId)
                ->first();

            /*
            |--------------------------------------------------------------------------
            | SKIP IF FRIEND NEVER WATCHED THIS ANIME
            |--------------------------------------------------------------------------
            */

            if (!$friendProgressRecord) {
                continue;
            }

            $friendProgress = $friendProgressRecord->episodeNumber;

            $diff = $myProgress - $friendProgress;

            /*
            |--------------------------------------------------------------------------
            | FRIEND NAME
            |--------------------------------------------------------------------------
            */

            $friend = User::find($friendId);

            if (!$friend) {
                continue;
            }

            $friendName = $friend->name;

            /*
            |--------------------------------------------------------------------------
            | MESSAGE
            |--------------------------------------------------------------------------
            */

            if ($diff > 0) {

                $messages[] =
                    "You are {$diff} episodes ahead of {$friendName}.";

            } elseif ($diff < 0) {

                $messages[] =
                    "{$friendName} is " . abs($diff) . " episodes ahead of you.";

            } else {

                $messages[] =
                    "You and {$friendName} are on the same episode.";
            }
        }

        /*
        |--------------------------------------------------------------------------
        | EMPTY
        |--------------------------------------------------------------------------
        */

        if (empty($messages)) {

            return response()->json([
                'status' => 'ok',
                'message' => 'No friends to compare progress with.'
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | SUCCESS
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'status' => 'ok',
            'message' => implode(" ", $messages)
        ]);
    }

    public function getFriends($userId)
    {
        // prijatelji gdje je user friend1
        $friends1 = FriendRequest::where('friend1', $userId)
            ->where('status', '1')
            ->pluck('friend2');

        // prijatelji gdje je user friend2
        $friends2 = FriendRequest::where('friend2', $userId)
            ->where('status', '1')
            ->pluck('friend1');

        // spoji oba seta ID-eva
        return $friends1->merge($friends2)->unique()->values();
    }





}
