<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('animeStatuses', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('anime_id');
        $table->unsignedBigInteger('user_id');
        $table->string('status');

        $table->foreign('anime_id')->references('id')->on('anime')->onDelete('cascade');
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });
}



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('animeStatuses');
    }
};
