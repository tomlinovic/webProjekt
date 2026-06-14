<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnimeStatuses extends Model
{
    //animestatuses
    protected $table = 'animestatuses';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'anime_id',
        'status'
    ];

    public function anime()
    {
        return $this->belongsTo(Anime::class, 'anime_id');
    }

}
