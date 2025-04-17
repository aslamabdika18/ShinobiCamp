<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-secondary to-primary">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 hover:scale-105">
      <h2 class="text-3xl font-bold text-center text-primary mb-6">Sign Up</h2>
      <form @submit.prevent="submitForm" class="space-y-6">
        <FormInput
          id="name-input"
          label="Name"
          type="text"
          v-model="form.name"
          placeholder="Enter your name"
          required
        />
        <FormInput
          id="email-input"
          label="Email"
          type="email"
          v-model="form.email"
          placeholder="Enter your email"
          required
        />
        <FormInput
          id="password-input"
          label="Password"
          type="password"
          v-model="form.password"
          placeholder="Enter your password"
          required
        />
        <FormInput
          id="password-confirmation-input"
          label="Confirm Password"
          type="password"
          v-model="form.password_confirmation"
          placeholder="Confirm your password"
          required
        />
        <button
          type="submit"
          class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors duration-200"
          :disabled="loading"
        >
          <span v-if="loading">Processing...</span>
          <span v-else>Sign Up</span>
        </button>
      </form>
      <p v-if="errorMessage" class="mt-4 text-center text-red-500">{{ errorMessage }}</p>
      <p class="mt-6 text-center text-gray-600">
        Already have an account?
        <router-link to="/signin" class="text-secondary hover:underline">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import FormInput from '@/components/FormInput.vue';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const submitForm = async () => {
  // Validasi password confirmation
  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await authStore.register(form);
    // Tampilkan pesan sukses
    successMessage.value = 'Registration successful! Please login with your credentials.';

    // Kosongkan form
    form.name = '';
    form.email = '';
    form.password = '';
    form.password_confirmation = '';

    // Redirect ke halaman login setelah 2 detik
    setTimeout(() => {
      router.push('/signin');
    }, 2000);

  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
