<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Event Management</h1>

    <!-- Tombol Tambah Event -->
    <div class="flex justify-start mb-4">
      <router-link to="/dashboard/crud-menu/addevent"
        class="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600 transition-colors flex items-center">
        <font-awesome-icon :icon="['fas', 'plus']" class="mr-2" />
        Tambah Event
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-6">
      <div class="flex justify-center items-center mb-6">
        <div class="relative">
          <div class="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <div class="absolute top-0 right-0 h-12 w-12 rounded-full border-r-4 border-l-4 border-blue-300 animate-ping opacity-60"></div>
        </div>
        <p class="ml-3 text-lg font-medium text-gray-700">Memuat events...</p>
      </div>
      <SkeletonLoader :count="3" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded mb-4">
      <p class="font-bold">Error:</p>
      <p>{{ error }}</p>
      <button @click="loadEvents" class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        Coba Lagi
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="events.length === 0" class="text-center py-12 text-gray-500">
      <font-awesome-icon :icon="['far', 'calendar-times']" class="text-4xl mb-2" />
      <p class="text-xl">Tidak ada event ditemukan</p>
      <p class="mt-2">Buat event untuk memulai</p>
    </div>

    <!-- Daftar Event (Responsive) -->
    <div v-else>
      <!-- Tabel Daftar Event (Desktop) -->
      <div class="hidden md:block">
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
            <tr v-for="event in events" :key="event.id" class="border-b">
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
                <span :class="{
                  'bg-green-100 text-green-800': event.is_active,
                  'bg-red-100 text-red-800': !event.is_active,
                }" class="px-3 py-1 rounded-full text-sm">
                  {{ event.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="showDetail(event)"
                    class="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition-colors"
                    title="View Details">
                    <font-awesome-icon :icon="['fas', 'info-circle']" />
                  </button>
                  <router-link :to="`/dashboard/crud-menu/editevent/${event.id}`"
                    class="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition-colors"
                    title="Edit Event">
                    <font-awesome-icon :icon="['fas', 'edit']" />
                  </router-link>
                  <button @click="confirmDelete(event.id)"
                    class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
                    title="Delete Event" :disabled="deletingId === event.id">
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
      <div class="block md:hidden space-y-4">
        <div v-for="event in events" :key="event.id" class="bg-white rounded-lg shadow-md p-4">
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
            <span :class="{
              'bg-green-100 text-green-800': event.is_active,
              'bg-red-100 text-red-800': !event.is_active,
            }" class="px-3 py-1 rounded-full text-sm">
              {{ event.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="flex space-x-2">
            <button @click="showDetail(event)"
              class="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition-colors">
              <font-awesome-icon :icon="['fas', 'info-circle']" />
            </button>
            <router-link :to="`/dashboard/crud-menu/editevent/${event.id}`"
              class="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition-colors">
              <font-awesome-icon :icon="['fas', 'edit']" />
            </router-link>
            <button @click="confirmDelete(event.id)"
              class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
              :disabled="deletingId === event.id">
              <font-awesome-icon v-if="deletingId === event.id" :icon="['fas', 'spinner']" spin />
              <font-awesome-icon v-else :icon="['fas', 'trash']" />
            </button>
          </div>
        </div>
      </div>

      <!-- Modal untuk Detail Event -->
      <div v-if="isDetailModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                <img :src="detailEvent.poster" alt="Poster" class="mt-2 w-full h-48 object-cover rounded-lg" />
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
                  <a :href="detailEvent.proposal" target="_blank"
                    class="text-blue-600 hover:underline flex items-center">
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
                <span :class="{
                  'bg-green-100 text-green-800': detailEvent.is_active,
                  'bg-red-100 text-red-800': !detailEvent.is_active,
                }" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ detailEvent.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Tombol Tutup -->
          <div class="mt-6 flex justify-end">
            <button type="button" @click="closeDetailModal"
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="mt-6 flex justify-center" v-if="eventStore.pagination && eventStore.pagination.total > 0">
        <Bootstrap5Pagination
          :data="{
            current_page: eventStore.pagination.currentPage || 1,
            last_page: eventStore.pagination.totalPages || 1,
            per_page: eventStore.pagination.perPage || 10,
            total: eventStore.pagination.total || 0
          }"
          @pagination-change-page="handlePageChange"
          :limit="2"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEventStore } from '@/stores/eventStore'
import { Bootstrap5Pagination } from 'laravel-vue-pagination'
import { toast } from 'vue3-toastify'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

// Initialize event store
const eventStore = useEventStore()

// State variables
const isDetailModalOpen = ref(false)
const detailEvent = ref({})
const deletingId = ref(null)

// Computed properties untuk mengakses state dari store
const events = computed(() => eventStore.events || [])
const isLoading = computed(() => eventStore.isLoading)
const error = computed(() => eventStore.error)

// Load events when component is mounted
onMounted(() => {
  loadEvents()
})

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Load events from the API
const loadEvents = async (page = 1) => {
  try {
    await eventStore.fetchEvents({ page })
  } catch (err) {
    console.error('Failed to load events:', err)
  }
}

// Handle page change from pagination component
const handlePageChange = (page) => {
  loadEvents(page)
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
  if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return

  try {
    deletingId.value = id
    await eventStore.deleteEvent(id)
    // Refresh the events after deletion
    await loadEvents(eventStore.pagination?.currentPage || 1)
    toast.success('Event berhasil dihapus!')
  } catch (err) {
    console.error('Failed to delete event:', err)
    toast.error('Gagal menghapus event. Silakan coba lagi.')
  } finally {
    deletingId.value = null
  }
}
</script>
