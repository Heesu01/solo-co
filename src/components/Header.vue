<template>
  <header class="fixed top-0 left-0 z-20 w-full">
    <div class="mx-auto px-4 pt-4">
      <div
        class="flex items-center justify-between rounded-full bg-white/95 px-6 py-3 shadow-md backdrop-blur"
      >
        <div class="flex items-center gap-10">
          <RouterLink to="/" class="flex items-center gap-2 mr-4">
            <img
              src="@/assets/logo.svg"
              alt="Solo&Co Logo"
              class="h-10 w-10 object-contain scale-150 ml-4"
            />
          </RouterLink>

          <nav class="hidden items-center gap-10 text-sm font-medium text-slate-600 md:flex">
            <RouterLink
              to="/solo"
              class="transition-colors hover:text-slate-900"
              active-class="text-slate-900 font-semibold"
            >
              개인 여행
            </RouterLink>
            <RouterLink
              to="/group"
              class="transition-colors hover:text-slate-900"
              active-class="text-slate-900 font-semibold"
            >
              그룹 여행
            </RouterLink>
          </nav>
        </div>

        <div class="flex items-center gap-3">
          <template v-if="!isAuthenticated">
            <RouterLink
              to="/login"
              class="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              로그인
            </RouterLink>
            <RouterLink
              to="/signup"
              class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              가입하기
            </RouterLink>
          </template>

          <template v-else>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-200"
              >
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-indigo-400 to-violet-500 text-xs font-semibold text-white"
                >
                  {{ userInitial }}
                </div>

                <span class="max-w-[120px] truncate font-medium">
                  {{ userName || '사용자' }}
                </span>
              </button>
              <button
                type="button"
                @click="handleLogout"
                class="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
              >
                로그아웃
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { logout } from '@/api/auth'

const { isAuthenticated, userName, clearAuth } = useAuth()
const router = useRouter()

const userInitial = computed(() => {
  if (!userName.value) return '?'
  return userName.value.trim().charAt(0).toUpperCase()
})

const handleLogout = async () => {
  try {
    await logout()
  } catch (e) {
    console.warn('서버 로그아웃 실패 — 그래도 로컬 로그아웃 진행합니다.')
  }

  clearAuth()
  router.push('/login')
}
</script>
