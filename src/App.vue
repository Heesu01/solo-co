<script setup>
import Header from '@/components/Header.vue'
import { RouterView } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, userName, clearAuth } = useAuth()

const handleLogout = () => {
  clearAuth()
}
</script>

<template>
  <div class="font-sans">
    <Header :isAuthenticated="isAuthenticated" :userName="userName" @logout="handleLogout" />
    <router-view />
  </div>
</template>
