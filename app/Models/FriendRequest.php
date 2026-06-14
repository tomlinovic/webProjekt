<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FriendRequest extends Model
{
    //
    protected $table = 'friendrequests';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'friend1',
        'friend2',
        'status'
    ];

    public function friend1User()
    {
        return $this->belongsTo(User::class, 'friend1');
    }

    public function friend2User()
    {
        return $this->belongsTo(User::class, 'friend2');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'friend1');
    }


}
