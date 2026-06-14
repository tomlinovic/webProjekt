<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comments extends Model
{
    //
    protected $table = 'comments';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'anime_id',
        'animeEpisode',
        'text'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}
