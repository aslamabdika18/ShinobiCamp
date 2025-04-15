<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'poster' => $this->poster ? asset('storage/' . $this->poster) : null,
            'proposal' => $this->proposal ? asset('storage/' . $this->proposal) : null,
            'slug' => $this->slug,
            'description' => $this->description,
            'location' => $this->location,
            'first_event_date' => $this->first_event_date->format('Y-m-d'),
            'last_event_date' => $this->last_event_date->format('Y-m-d'),
            'register_deadline' => $this->register_deadline->format('Y-m-d'),
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
