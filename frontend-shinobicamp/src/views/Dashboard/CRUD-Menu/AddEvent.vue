<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">{{ isEditing ? 'Edit Event' : 'Tambah Event' }}</h1>

    <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Left Column: Main Information -->
      <div class="space-y-4">
        <FormInput v-model="form.name" label="Event Name" required />
        <div>
          <label class="block text-sm font-medium text-gray-700">Poster</label>
          <input
            type="file"
            @change="handleFileUpload($event, 'poster')"
            class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div v-if="form.poster && typeof form.poster === 'string'" class="mt-2">
            <img :src="form.poster" alt="Current poster" class="h-24 object-contain" />
            <p class="text-xs text-gray-500">Current poster</p>
          </div>
        </div>
        <FormTextarea v-model="form.description" label="Description" required />
      </div>

      <!-- Right Column: Additional Information -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Proposal</label>
          <input
            type="file"
            @change="handleFileUpload($event, 'proposal')"
            class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div v-if="form.proposal && typeof form.proposal === 'string'" class="mt-2">
            <p class="text-xs text-gray-500">Current proposal: {{ form.proposal }}</p>
          </div>
        </div>
        <FormInput v-model="form.location" label="Location" required />
        <FormInput v-model="form.first_event_date" label="First Event Date" type="date" required />
        <FormInput v-model="form.last_event_date" label="Last Event Date" type="date" required />
        <FormInput v-model="form.registration_deadline" label="Register Deadline" type="date" required />
        <FormSelect v-model="form.status" label="Status" :options="statusOptions" required />
      </div>

      <!-- Action Buttons -->
      <div class="md:col-span-2 flex justify-end space-x-4">
        <router-link
          to="/dashboard/events"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          Batal
        </router-link>
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Loading...' : isEditing ? 'Update' : 'Simpan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventStore } from '@/stores/eventStore'
import FormInput from '@/views/Dashboard/components/FormInput.vue'
import FormTextarea from '@/views/Dashboard/components/FormTextarea.vue'
import FormSelect from '@/views/Dashboard/components/FormSelect.vue'

const route = useRoute()
const router = useRouter()
const eventStore = useEventStore()

const form = ref({
  id: null,
  name: '',
  poster: '',
  proposal: '',
  description: '',
  location: '',
  first_event_date: new Date().toISOString().split('T')[0],
  last_event_date: new Date().toISOString().split('T')[0],
  registration_deadline: new Date().toISOString().split('T')[0],
  status: 'Aktif',
})

// Handle file uploads
const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0]
  if (file) {
    form.value[fieldName] = file
  }
}

const statusOptions = [
  { value: 'Aktif', label: 'Aktif' },
  { value: 'Nonaktif', label: 'Nonaktif' },
]

const isEditing = computed(() => !!route.params.eventId)
const isLoading = ref(false)

// Fetch event data if in edit mode
if (isEditing.value) {
  const fetchEventData = async () => {
    try {
      await eventStore.fetchEvent(route.params.eventId)
      const eventData = eventStore.currentEvent

      // Copy event data to form
      Object.keys(form.value).forEach(key => {
        if (eventData[key] !== undefined) {
          form.value[key] = eventData[key]
        }
      })

      // Set ID separately
      form.value.id = eventData.id
    } catch (error) {
      console.error('Error fetching event data:', error)
    }
  }
  fetchEventData()
}

// Submit form (create or update)
const submitForm = async () => {
  isLoading.value = true
  try {
    if (isEditing.value) {
      await eventStore.updateEvent(form.value.id, form.value)
      alert('Event berhasil diupdate!')
    } else {
      await eventStore.createEvent(form.value)
      alert('Event berhasil ditambahkan!')
    }
    router.push('/dashboard/events')
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Terjadi kesalahan. Silakan coba lagi.')
  } finally {
    isLoading.value = false
  }
}
</script>
