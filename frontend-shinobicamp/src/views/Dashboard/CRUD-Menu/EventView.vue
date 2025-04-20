<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Daftar Event</h1>
      <router-link
        to="/dashboard/crud-menu/addevent"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Tambah Event
      </router-link>
      <router-link
        to="/dashboard/events"
        class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
      >
        Kembali
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-6">
      <div class="flex justify-center items-center mb-6">
        <div class="relative">
          <div class="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <div class="absolute top-0 right-0 h-12 w-12 rounded-full border-r-4 border-l-4 border-blue-300 animate-ping opacity-60"></div>
        </div>
        <p class="ml-3 text-lg font-medium text-gray-700">Loading events...</p>
      </div>
      <SkeletonLoader :count="6" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- Event List -->
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="event in events" :key="event.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <img :src="event.poster" :alt="event.name" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2">{{ event.name }}</h3>
          <p class="text-gray-600 mb-2 line-clamp-2">{{ event.description }}</p>
          <p class="text-gray-500 text-sm mb-2">Lokasi: {{ event.location }}</p>
          <p class="text-gray-500 text-sm mb-2">Deadline: {{ formatDate(event.register_deadline) }}</p>
          <div class="flex items-center justify-between mt-4">
            <span :class="['px-2 py-1 rounded text-sm', event.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
              {{ event.is_active ? 'Aktif' : 'Nonaktif' }}
            </span>
            <div class="space-x-2">
              <router-link
                :to="`/dashboard/crud-menu/editevent/${event.id}`"
                class="text-blue-500 hover:text-blue-700"
              >
                Edit
              </router-link>
              <button
                @click="deleteEvent(event.id)"
                class="text-red-500 hover:text-red-700"
                :disabled="isDeleting"
              >
                {{ isDeleting === event.id ? 'Menghapus...' : 'Hapus' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && !error && events.length === 0" class="text-center py-8 text-gray-500">
      <p>Belum ada event yang ditambahkan</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEventStore } from '@/stores/eventStore'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { toast } from 'vue3-toastify'

const eventStore = useEventStore()
const isDeleting = ref(null)

/**
 * Format tanggal ke format yang lebih mudah dibaca
 * @param {string} dateString - String tanggal dari API
 * @returns {string} - Tanggal yang sudah diformat
 */
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

/**
 * Computed properties untuk mengakses state dari store
 */
const events = computed(() => eventStore.events)
const isLoading = computed(() => eventStore.isLoading)
const error = computed(() => eventStore.error)

/**
 * Mengambil data event dari API
 */
const fetchEvents = async () => {
  try {
    await eventStore.fetchEvents()
  } catch (err) {
    console.error('Error fetching events:', err)
  }
}

/**
 * Menghapus event berdasarkan ID
 * @param {number} eventId - ID event yang akan dihapus
 */
const deleteEvent = async (eventId) => {
  if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return

  isDeleting.value = eventId
  try {
    await eventStore.deleteEvent(eventId)
    toast.success('Event berhasil dihapus!')
  } catch (err) {
    console.error('Error deleting event:', err)
    toast.error('Gagal menghapus event. Silakan coba lagi.')
  } finally {
    isDeleting.value = null
  }
}

// Fetch events saat komponen dimuat
onMounted(() => {
  fetchEvents()
})
</script>
