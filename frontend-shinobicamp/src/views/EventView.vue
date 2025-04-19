<template>
  <div class="bg-white min-h-screen p-8">
    <h1 class="text-4xl font-bold text-primary mb-8">Upcoming Events</h1>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <!-- Error message -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
      {{ error }}
    </div>

    <!-- No events message -->
    <div v-else-if="events.length === 0" class="text-center py-12 text-gray-600">
      Tidak ada event yang akan datang.
    </div>

    <!-- Event cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :event="{
          id: event.id,
          name: event.title || event.name,
          description: event.description,
          date: formatDate(event.date),
          location: event.location,
          image: event.poster || event.image || 'https://via.placeholder.com/300x400',
        }"
      />
    </div>
  </div>
</template>

<script setup>
// Impor komponen EventCard dan store
import EventCard from '@/components/EventCard.vue'
import { useEventStore } from '@/stores/eventStore'
import { ref, onMounted, computed } from 'vue'

// Inisialisasi event store
const eventStore = useEventStore()
const isLoading = ref(true)
const error = ref(null)

// Computed property untuk mengakses events dari store
const events = computed(() => eventStore.events)

// Format tanggal
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Mengambil data event dari API
const fetchEvents = async () => {
  isLoading.value = true
  try {
    await eventStore.fetchEvents()
  } catch (err) {
    console.error('Error fetching events:', err)
    error.value = 'Gagal memuat data event. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}

// Fetch events saat komponen dimuat
onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
/* Custom styles can be added here if needed */
</style>
