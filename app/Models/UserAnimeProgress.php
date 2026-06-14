<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAnimeProgress extends Model
{
    //
    protected $table = 'useranimeprogress';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'anime_id',
        'episodeNumber'
    ];
}
