<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('friendrequests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('friend1');
            $table->unsignedBigInteger('friend2');
            $table->unsignedTinyInteger('status')->default(0);

            $table->foreign('friend1')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('friend2')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('friendrequests');
    }
};
