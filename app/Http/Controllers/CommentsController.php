<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Anime;
use App\Models\SpoilerAlerts;
use App\Models\Comments;
use App\Http\Controllers\FriendController;
use App\Models\FriendRequest;


class CommentsController extends Controller
{
    //
    public function showComments($anime_id, $episode_number)
    {
        $user = Auth::user();

        // 1. Dohvati anime
        $anime = Anime::findOrFail($anime_id);

        // 2. Dohvati sve komentare za tu epizodu
        $comments = Comments::where('anime_id', $anime_id)
            ->where('animeEpisode', $episode_number)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        // 3. Dohvati ID-eve prijatelja korisnika
        $friendController = new FriendController();
        $friendIDs = $friendController->getFriends($user->id);

        // 4. Filtriraj komentare prijatelja
        $friendComments = $comments->filter(fn($c) =>
            $friendIDs->contains($c->user_id)
        );

        // 5. Pretvori u JSON-friendly format
        $friendCommentsJson = $friendComments->values();
        $allCommentsJson = $comments->values();

        return view('comments_page', [
            'anime' => $anime,
            'episode' => $episode_number,
            'friendCommentsJson' => $friendCommentsJson,
            'allCommentsJson' => $allCommentsJson
        ]);
    }


    public function store(Request $request, $anime_id, $episode_number)
    {
        $request->validate([
            'text' => 'required|string|max:128'
        ]);
    
        $comment = Comments::create([
            'user_id' => Auth::id(),
            'anime_id' => $anime_id,
            'animeEpisode' => $episode_number,
            'text' => $request->text
        ]);
    
        return response()->json([
            'success' => true,
            'id' => $comment->id,
            'created_at' => $comment->created_at
        ]);
    }

    public function update(Request $request, $id)
    {
        $comment = Comments::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'text' => 'required|string|max:128',
        ]);

        $comment->text = $request->text;
        $comment->save();

        return response()->json([
            'success' => true,
            'text' => $comment->text,
        ]);
    }

    public function delete($id)
    {
        $comment = Comments::findOrFail($id);

        // sigurnost: može brisati samo vlasnik
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['success' => true]);
    }

    public function report($id)
    {

        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        }
        $comment = Comments::findOrFail($id);

        // korisnik ne može prijaviti svoj komentar
        if ($comment->user_id == Auth::id()) {
            return response()->json(['success' => false, 'error' => 'You cannot report your own comment']);
        }

        // provjeri je li već prijavio
        $already = SpoilerAlerts::where('user_id', Auth::id())
            ->where('comment_id', $id)
            ->exists();

        if ($already) {
            return response()->json(['success' => false, 'error' => 'Already reported']);
        }

        // spremi alert
        SpoilerAlerts::create([
            'user_id' => Auth::id(),
            'comment_id' => $id
        ]);

        // prebroji alertove
        $count = SpoilerAlerts::where('comment_id', $id)->count();

        // ako je 3 različitih korisnika → briši komentar
        if ($count >= 3) {
            $comment->delete();
            SpoilerAlerts::where('comment_id', $id)->delete();

            return response()->json([
                'success' => true,
                'deleted' => true
            ]);
        }

        return response()->json([
            'success' => true,
            'deleted' => false,
            'count' => $count
        ]);
    }







}
