import { reactive, computed } from 'vue'

const state = reactive({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
})

const isAuthenticated = computed(() => !!state.token)
const userName = computed(() => state.user?.name || '')

function setAuth({ token, user }) {
  state.token = token
  state.user = user
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

function setUser(user) {
  state.user = user
  localStorage.setItem('user', JSON.stringify(user))
}

function setUserName(name) {
  if (!state.user) state.user = {}
  state.user.name = name
  localStorage.setItem('user', JSON.stringify(state.user))
}

function clearAuth() {
  state.token = null
  state.user = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function useAuth() {
  return {
    isAuthenticated,
    userName,
    setAuth,
    setUser,
    setUserName,
    clearAuth,
  }
}
