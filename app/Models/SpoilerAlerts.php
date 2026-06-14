<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpoilerAlerts extends Model
{
    //
    protected $table = 'spoileralerts';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'comment_id'
    ];
}
