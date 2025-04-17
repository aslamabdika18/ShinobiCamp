<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat direktori untuk poster jika belum ada
        if (!file_exists(storage_path('app/public/posters'))) {
            mkdir(storage_path('app/public/posters'), 0755, true);
        }

        // Generate 50 event
        Event::factory()->count(50)->create();
    }
}
