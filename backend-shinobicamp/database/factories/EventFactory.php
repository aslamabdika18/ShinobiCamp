<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->sentence(3);
        $firstDate = $this->faker->dateTimeBetween('now', '+3 months');
        $lastDate = $this->faker->dateTimeBetween($firstDate, '+6 months');
        $registerDeadline = $this->faker->dateTimeBetween('-1 month', $firstDate);

        return [
            'name' => $name,
            'poster' => 'posters/' . $this->faker->image(storage_path('app/public/posters'), 800, 600, null, false),
            'proposal' => 'proposals/' . Str::random(10) . '.pdf',
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraphs(3, true),
            'location' => $this->faker->address,
            'first_event_date' => $firstDate,
            'last_event_date' => $lastDate,
            'register_deadline' => $registerDeadline,
            'is_active' => $this->faker->boolean(80), // 80% chance of being active
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
