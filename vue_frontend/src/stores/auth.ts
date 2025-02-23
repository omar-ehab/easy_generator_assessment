import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../lib/axios'
import API_ENDPOINTS from '@/lib/apiPaths.ts'

type User = {
  id: string
  email: string
  name: string
}

type LoginResponse = {
  payload: {
    access_token: string
    refresh_token?: string
  }
}

type UserResponse = {
  payload: {
    id: string
    email: string
    name: string
  }
}

interface RegisterData {
  email: string
  name: string
  password: string
}

interface LoginData {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const accessToken = ref<string | null>(localStorage.getItem('at'))
  const isAuthenticated = computed(() => {
    if (accessToken.value) {
      if (!user.value) {
        fetchUser()
      }
      return true
    }
    return false
  })

  async function fetchUser() {
    try {
      const { data } = await api.get<UserResponse>('/profile')
      user.value = data.payload
      localStorage.setItem('user', JSON.stringify(data.payload))
    } catch (error) {
      console.error('Failed to fetch user:', error)
      // If fetching user fails, we should probably log out
      await logout()
    }
  }

  async function login(data: LoginData) {
    try {
      const {
        data: { payload },
      } = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, { ...data, mode: 'cookie' })

      localStorage.setItem('at', payload.access_token)
      accessToken.value = payload.access_token

      if (payload.refresh_token) {
        localStorage.setItem('rt', payload.refresh_token)
      }

      await fetchUser()
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async function register(data: RegisterData) {
    try {
      const {
        data: { payload },
      } = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, { ...data, mode: 'cookie' })

      localStorage.setItem('at', payload.access_token)
      accessToken.value = payload.access_token

      if (payload.refresh_token) {
        localStorage.setItem('rt', payload.refresh_token)
      }

      await fetchUser()
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  async function logout() {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      localStorage.removeItem('at')
      localStorage.removeItem('rt')
      localStorage.removeItem('user')
      user.value = null
      accessToken.value = null
    }
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
