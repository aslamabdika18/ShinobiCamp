<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary to-secondary">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 hover:scale-105">
      <h2 class="text-3xl font-bold text-center text-primary mb-6">Sign In</h2>
      <form @submit.prevent="submitForm" class="space-y-6">
        <FormInput
          id="email-input"
          label="Email"
          type="email"
          v-model="formData.email"
          placeholder="Enter your email"
          required
        />
        <FormInput
          id="password-input"
          label="Password"
          type="password"
          v-model="formData.password"
          placeholder="Enter your password"
          required
        />
        <button
          type="submit"
          class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors duration-200"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Sign In' }}
        </button>
      </form>
      <p v-if="loginError" class="mt-4 text-center text-red-500">{{ loginError }}</p>
      <p class="mt-6 text-center text-gray-600">
        Don't have an account?
        <router-link to="/signup" class="text-secondary hover:underline">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import FormInput from '@/components/FormInput.vue';
import { toast } from 'vue3-toastify';

const auth = useAuthStore();
const router = useRouter();

const formData = reactive({
  email: '',
  password: '',
});

const loading = ref(false);
const loginError = ref(null);

const submitForm = async () => {
  try {
    loginError.value = null;
    loading.value = true;

    await auth.login(formData);
    toast.success('Login berhasil!', { autoClose: 5000 });
    router.push({ name: 'dashboard' });
  } catch (error) {
    loginError.value = error.response?.data?.message || error.message || 'Login failed';
  } finally {
    loading.value = false;
  }
};
</script>
