<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anime extends Model
{
    //
    protected $table = 'anime';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'title',
        'description',
        'episodes',
        'cover_image',
        'average_score',
        'status'
    ];

}
