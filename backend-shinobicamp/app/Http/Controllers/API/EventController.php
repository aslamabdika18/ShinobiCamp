<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventCollection;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Using eager loading to avoid N+1 problem
        // Even though we don't have explicit relations in the Event model currently,
        // we're using with() as a best practice to prevent future N+1 issues
        // when relations are added

        // Get pagination parameters from request
        $perPage = $request->input('per_page', 10); // Default 10 items per page
        // Removed unused $page variable since pagination is handled by Laravel
        // Apply pagination
        $events = Event::with([])->latest()->paginate($perPage);
        return new EventCollection($events);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'poster' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'proposal' => 'required|mimes:pdf|max:10240',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'first_event_date' => 'required|date',
            'last_event_date' => 'required|date|after_or_equal:first_event_date',
            'register_deadline' => 'required|date|before_or_equal:first_event_date',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Handle poster file upload
        $posterPath = null;
        if ($request->hasFile('poster')) {
            $posterPath = $request->file('poster')->store('posters', 'public');
        }

        // Handle proposal file upload
        $proposalPath = null;
        if ($request->hasFile('proposal')) {
            $proposalPath = $request->file('proposal')->store('proposals', 'public');
        }

        $event = Event::create([
            'name' => $request->name,
            'poster' => $posterPath,
            'proposal' => $proposalPath,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'location' => $request->location,
            'first_event_date' => $request->first_event_date,
            'last_event_date' => $request->last_event_date,
            'register_deadline' => $request->register_deadline,
            'is_active' => $request->is_active ?? false,
        ]);

        return new EventResource($event);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $event = Event::findOrFail($id);
        return new EventResource($event);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $event = Event::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'poster' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'proposal' => 'nullable|mimes:pdf|max:10240',
            'description' => 'string',
            'location' => 'string|max:255',
            'first_event_date' => 'date',
            'last_event_date' => 'date|after_or_equal:first_event_date',
            'register_deadline' => 'date|before_or_equal:first_event_date',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except(['poster', 'proposal']);

        // Handle poster file upload
        if ($request->hasFile('poster')) {
            // Delete old poster if exists
            if ($event->poster) {
                Storage::disk('public')->delete($event->poster);
            }
            $data['poster'] = $request->file('poster')->store('posters', 'public');
        }

        // Handle proposal file upload
        if ($request->hasFile('proposal')) {
            // Delete old proposal if exists
            if ($event->proposal) {
                Storage::disk('public')->delete($event->proposal);
            }
            $data['proposal'] = $request->file('proposal')->store('proposals', 'public');
        }

        $event->update($data);

        return new EventResource($event);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $event = Event::findOrFail($id);

        // Delete associated files
        if ($event->poster) {
            Storage::disk('public')->delete($event->poster);
        }

        if ($event->proposal) {
            Storage::disk('public')->delete($event->proposal);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
}
