<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anime', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->unsignedInteger('episodes')->default(0);
            $table->unsignedInteger('average_score')->nullable();
            $table->text('description')->nullable();
            $table->string('cover_image', 500)->nullable();
            $table->string('status')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anime');
    }
};
