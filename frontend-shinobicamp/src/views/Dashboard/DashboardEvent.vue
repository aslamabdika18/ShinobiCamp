<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Event Management</h1>

    <!-- Tombol Tambah Event -->
    <div class="flex justify-start mb-4">
      <router-link
        to="/dashboard/crud-menu/addevent"
        class="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600 transition-colors flex items-center"
      >
        <font-awesome-icon :icon="['fas', 'plus']" class="mr-2" />
        Tambah Event
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="eventStore.isLoading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <font-awesome-icon :icon="['fas', 'spinner']" spin class="text-3xl text-blue-500 mb-2" />
        <p>Loading events...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="eventStore.error" class="bg-red-100 text-red-700 p-4 rounded mb-4">
      <p class="font-bold">Error:</p>
      <p>{{ eventStore.error }}</p>
      <button
        @click="loadEvents"
        class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="eventStore.events.length === 0" class="text-center py-12 text-gray-500">
      <font-awesome-icon :icon="['far', 'calendar-times']" class="text-4xl mb-2" />
      <p class="text-xl">No events found</p>
      <p class="mt-2">Create an event to get started</p>
    </div>

    <!-- Tabel Daftar Event (Desktop) -->
    <div v-else class="hidden md:block">
      <table class="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-4 text-left">Event Name</th>
            <th class="py-3 px-4 text-left">Poster</th>
            <th class="py-3 px-4 text-left">Description</th>
            <th class="py-3 px-4 text-left">Location</th>
            <th class="py-3 px-4 text-left">Register Deadline</th>
            <th class="py-3 px-4 text-left">Status</th>
            <th class="py-3 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in eventStore.events" :key="event.id" class="border-b">
            <td class="py-3 px-4">{{ event.name }}</td>
            <td class="py-3 px-4">
              <img :src="event.poster" alt="Poster" class="w-16 h-16 object-cover rounded" />
            </td>
            <td class="py-3 px-4">
              <div class="max-w-xs truncate">{{ event.description }}</div>
            </td>
            <td class="py-3 px-4">{{ event.location }}</td>
            <td class="py-3 px-4">{{ formatDate(event.register_deadline) }}</td>
            <td class="py-3 px-4">
              <span
                :class="{
                  'bg-green-100 text-green-800': event.is_active,
                  'bg-red-100 text-red-800': !event.is_active,
                }"
                class="px-3 py-1 rounded-full text-sm"
              >
                {{ event.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="py-3 px-4">
              <div class="flex space-x-2">
                <button
                  @click="showDetail(event)"
                  class="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition-colors"
                  title="View Details"
                >
                  <font-awesome-icon :icon="['fas', 'info-circle']" />
                </button>
                <router-link
                  :to="`/dashboard/crud-menu/editevent/${event.id}`"
                  class="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition-colors"
                  title="Edit Event"
                >
                  <font-awesome-icon :icon="['fas', 'edit']" />
                </router-link>
                <button
                  @click="confirmDelete(event.id)"
                  class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
                  title="Delete Event"
                  :disabled="deletingId === event.id"
                >
                  <font-awesome-icon v-if="deletingId === event.id" :icon="['fas', 'spinner']" spin />
                  <font-awesome-icon v-else :icon="['fas', 'trash']" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card Daftar Event (Mobile) -->
    <div v-else class="block md:hidden space-y-4">
      <div v-for="event in eventStore.events" :key="event.id" class="bg-white rounded-lg shadow-md p-4">
        <div class="mb-2"><strong>Event Name:</strong> {{ event.name }}</div>
        <div class="mb-2">
          <strong>Poster:</strong>
          <img :src="event.poster" alt="Poster" class="w-16 h-16 object-cover rounded mt-1" />
        </div>
        <div class="mb-2"><strong>Description:</strong>
          <div class="line-clamp-2">{{ event.description }}</div>
        </div>
        <div class="mb-2"><strong>Location:</strong> {{ event.location }}</div>
        <div class="mb-2">
          <strong>Register Deadline:</strong> {{ formatDate(event.register_deadline) }}
        </div>
        <div class="mb-2">
          <strong>Status:</strong>
          <span
            :class="{
              'bg-green-100 text-green-800': event.is_active,
              'bg-red-100 text-red-800': !event.is_active,
            }"
            class="px-3 py-1 rounded-full text-sm"
          >
            {{ event.is_active ? 'Active' : 'Inactive' }}
          </span>
        </div>
        <div class="flex space-x-2">
          <button
            @click="showDetail(event)"
            class="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition-colors"
          >
            <font-awesome-icon :icon="['fas', 'info-circle']" />
          </button>
          <router-link
            :to="`/dashboard/crud-menu/editevent/${event.id}`"
            class="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            <font-awesome-icon :icon="['fas', 'edit']" />
          </router-link>
          <button
            @click="confirmDelete(event.id)"
            class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
            :disabled="deletingId === event.id"
          >
            <font-awesome-icon v-if="deletingId === event.id" :icon="['fas', 'spinner']" spin />
            <font-awesome-icon v-else :icon="['fas', 'trash']" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal untuk Detail Event -->
    <div
      v-if="isDetailModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Detail Event</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Kolom Kiri: Informasi Utama -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Event Name</label>
              <p class="mt-1 text-lg font-semibold text-gray-900">{{ detailEvent.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Poster</label>
              <img
                :src="detailEvent.poster"
                alt="Poster"
                class="mt-2 w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <p class="mt-1 text-gray-700">{{ detailEvent.description }}</p>
            </div>
          </div>

          <!-- Kolom Kanan: Informasi Tambahan -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Proposal</label>
              <div class="mt-1">
                <a
                  :href="detailEvent.proposal"
                  target="_blank"
                  class="text-blue-600 hover:underline flex items-center"
                >
                  <font-awesome-icon :icon="['fas', 'file-pdf']" class="mr-2" />
                  View Proposal
                </a>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Slug</label>
              <p class="mt-1 text-gray-700">{{ detailEvent.slug }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location</label>
              <p class="mt-1 text-gray-700">{{ detailEvent.location }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">First Event Date</label>
              <p class="mt-1 text-gray-700">{{ formatDate(detailEvent.first_event_date) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Last Event Date</label>
              <p class="mt-1 text-gray-700">{{ formatDate(detailEvent.last_event_date) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Register Deadline</label>
              <p class="mt-1 text-gray-700">{{ formatDate(detailEvent.register_deadline) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <span
                :class="{
                  'bg-green-100 text-green-800': detailEvent.is_active,
                  'bg-red-100 text-red-800': !detailEvent.is_active,
                }"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ detailEvent.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Tombol Tutup -->
        <div class="mt-6 flex justify-end">
          <button
            type="button"
            @click="closeDetailModal"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEventStore } from '@/stores/eventStore'

// Initialize event store
const eventStore = useEventStore()

// State variables
const isDetailModalOpen = ref(false)
const detailEvent = ref({})
const deletingId = ref(null)

// Load events when component is mounted
onMounted(() => {
  loadEvents()
})

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Load events from the API
const loadEvents = async () => {
  try {
    await eventStore.fetchEvents()
  } catch (error) {
    console.error('Failed to load events:', error)
  }
}

// Show event details in modal
const showDetail = (event) => {
  detailEvent.value = event
  isDetailModalOpen.value = true
}

// Close detail modal
const closeDetailModal = () => {
  isDetailModalOpen.value = false
}

// Confirm and delete event
const confirmDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this event?')) return

  try {
    deletingId.value = id
    await eventStore.deleteEvent(id)
  } catch (error) {
    console.error('Failed to delete event:', error)
    alert('Failed to delete event. Please try again.')
  } finally {
    deletingId.value = null
  }
}
</script>
