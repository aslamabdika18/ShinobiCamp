<template>
  <div class="animate-pulse">
    <div class="space-y-4">
      <!-- Header Skeleton -->
      <div class="h-8 bg-gray-200 rounded w-1/4"></div>

      <!-- Card Skeletons -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in count" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden">
          <!-- Image Skeleton -->
          <div class="w-full h-48 bg-gray-300"></div>

          <!-- Content Skeleton -->
          <div class="p-4 space-y-3">
            <div class="h-6 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>

            <!-- Action Buttons Skeleton -->
            <div class="flex space-x-2 pt-2">
              <div class="h-10 w-10 bg-gray-200 rounded"></div>
              <div class="h-10 w-10 bg-gray-200 rounded"></div>
              <div class="h-10 w-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 3
  }
});
</script>
