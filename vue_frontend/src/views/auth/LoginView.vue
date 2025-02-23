<template>
  <div class="flex flex-col h-dvh w-dvw items-center justify-center bg-white">
    <img :src="Logo" alt="Easy Generator Logo" class="w-64 mb-8" />
    <div
      class="rounded-xl border border-[rgb(228,228,231)] bg-white text-[rgb(9,9,11)] shadow min-w-96"
    >
      <div class="flex flex-col space-y-1.5 p-6 text-center">
        <h3 class="font-semibold tracking-tight text-2xl">Login</h3>
      </div>
      <div class="p-6 pt-0">
        <Form
          @submit="handleLogin"
          :validation-schema="toTypedSchema(loginSchema)"
          v-slot="{ errors, isSubmitting }"
          class="space-y-8"
        >
          <div class="space-y-1">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <Field name="email" type="email" v-slot="{ field, errorMessage }">
              <input
                type="email"
                v-bind="field"
                :class="{ error: errorMessage }"
                class="flex h-9 w-full rounded-md border border-[#e4e4e7] bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#09090b] placeholder:text-[#71717a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#18181b] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
              <span v-if="errorMessage" class="text-[0.8rem] font-medium text-red-500">{{
                  errorMessage
                }}</span>
            </Field>
          </div>
          <div class="space-y-1">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <Field name="password" type="password" v-slot="{ field, errorMessage }">
              <input
                type="password"
                v-bind="field"
                :class="{ error: errorMessage }"
                class="flex h-9 w-full rounded-md border border-[#e4e4e7] bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#09090b] placeholder:text-[#71717a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#18181b] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
              <span v-if="errorMessage" class="text-[0.8rem] font-medium text-red-500">{{
                  errorMessage
                }}</span>
            </Field>
          </div>
          <button type="submit" :disabled="isSubmitting" class="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#18181b] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[#18181b] text-[#fafafa] shadow hover:bg-[#18181b]/90 h-9 px-4 py-2 w-full">
            {{ isSubmitting ? 'Login...' : 'Login' }}
          </button>
          <p v-if="apiError">{{ apiError }}</p>
          <p class="text-center">
            <span class='text-zinc-700'>Don't have an account?</span>
            <router-link to="/auth/register" class='font-bold text-zinc-900'>Register</router-link>
          </p>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuthStore } from '@/stores/auth'
import { loginSchema, type LoginFormData } from '@/validations/auth'
import Logo from '@/assets/logo.svg'

const router = useRouter()
const authStore = useAuthStore()
const apiError = ref('')

const handleLogin = async (values: LoginFormData) => {
  try {
    apiError.value = ''
    await authStore.login(values)
    await router.push('/dashboard/profile')
  } catch (error) {
    console.error(error)
    apiError.value = 'Login failed. Please check your credentials and try again.'
  }
}
</script>
