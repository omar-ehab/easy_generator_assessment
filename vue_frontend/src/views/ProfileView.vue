<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
const router = useRouter()
const { user, logout } = useAuthStore()

const handleLogout = async () => {
  try {
    await logout()
    await router.push('/auth/login')
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="flex flex-col h-dvh w-dvw items-center justify-center bg-gray-100">
    <div
      class="rounded-xl border border-[rgb(228,228,231)] bg-white text-[rgb(9,9,11)] shadow w-full max-w-md p-6"
    >
      <div class="flex flex-col items-center">
        <div
          class="flex size-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white"
        >
          {{ user?.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase() }}
        </div>
        <h2 class="mt-4 text-xl font-semibold text-gray-900">Omar Ehab</h2>
        <p class="text-gray-500">topdollar57@gmail.com</p>
      </div>
      <div class="mt-6 space-y-4">
        <div class="flex justify-between border-b border-[rgb(228,228,231)] pb-2">
          <span class="text-gray-600">User ID:</span
          ><span class="font-medium text-gray-900">{{user?.id ?? ''}}</span>
        </div>
        <div class="flex justify-between border-b border-[rgb(228,228,231)] pb-2">
          <span class="text-gray-600">Full Name:</span
          ><span class="font-medium text-gray-900">{{user?.name ?? ''}}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Email:</span
          ><span class="font-medium text-gray-900">{{user?.email ?? ''}}</span>
        </div>
      </div>
      <div class="mt-6 flex justify-center space-x-4">
        <button
          @click="handleLogout"
          class="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow h-9 px-4 py-2 bg-red-600 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>
