<template>
  <div class="bg-slate-50">
    <div class="mx-auto max-w-6xl px-4 pt-28 pb-16 md:pt-32">
      <div class="relative overflow-visible">
        <img
          src="@/assets/bg-login.svg"
          alt="decor background"
          class="pointer-events-none absolute left-80 top-80 w-[700px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70"
        />

        <div
          class="relative grid gap-10 px-8 py-10 md:grid-cols-2 md:gap-16 md:px-12 lg:px-20 lg:py-16"
        >
          <section class="flex flex-col justify-center gap-6">
            <div class="space-y-3">
              <p class="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                solo&co travel planner
              </p>
              <h1
                class="text-3xl font-title leading-tight text-slate-900 md:text-4xl lg:text-[40px]"
              >
                로그인하고<br />
                여행을 더 쉽고 가볍게
              </h1>
            </div>

            <p class="text-sm leading-relaxed text-slate-500 md:text-[15px]">
              AI가 취향과 일정에 맞춘 여행 루트를 자동으로 추천해줘요.
              <br class="hidden md:block" />지도 기반 장소 추천부터 혼행 난이도, 그룹 일정
              관리까지<br class="hidden md:block" />
              여행 준비를 하나의 플랫폼에서 편하게 해결해 보세요.
            </p>

            <ul class="mt-2 space-y-1.5 text-xs text-slate-500 md:text-[13px]">
              <li>• 지도 기반 장소 추천 + 일정 자동 생성</li>
              <li>• 친구/가족과 함께 프로젝트로 일정 공유</li>
              <li>• 날씨 · 이동시간까지 고려한 최적 루트 제안</li>
            </ul>
          </section>

          <img
            src="@/assets/character-login.svg"
            alt="여행 캐릭터"
            class="pointer-events-none absolute right-115 bottom-0 hidden w-70 lg:block drop-shadow-lg"
          />

          <section class="flex items-center justify-center md:justify-end">
            <div class="flex w-full items-end justify-end">
              <div
                class="z-10 w-full max-w-sm rounded-2xl bg-white/90 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur"
              >
                <div class="mb-6 space-y-1">
                  <div class="flex items-center justify-between gap-3">
                    <div class="text-xl font-semibold text-slate-700">Solo&Co 계정으로 로그인</div>
                    <img src="@/assets/logo.svg" alt="Solo&Co Logo" class="h-8 w-auto" />
                  </div>
                  <p class="text-[11px] text-slate-400">
                    한 번 로그인하면 개인/그룹 여행 프로젝트를 모두 관리할 수 있어요.
                  </p>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-medium text-slate-600">아이디</label>
                  <input
                    v-model="email"
                    type="email"
                    placeholder="아이디를 입력해주세요"
                    class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div class="mt-4 space-y-2">
                  <label class="text-xs font-medium text-slate-600">비밀번호</label>
                  <div
                    class="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50/40 px-4 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100"
                  >
                    <input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="비밀번호를 입력해주세요"
                      class="w-full bg-transparent text-sm outline-none"
                    />
                    <button
                      class="w-10 ml-2 text-xs text-slate-400 hover:text-slate-600"
                      @click="togglePassword"
                    >
                      {{ showPassword ? '숨기기' : '보기' }}
                    </button>
                  </div>

                  <button class="mt-1 text-right text-[11px] text-slate-400 hover:text-slate-600">
                    비밀번호를 잊으셨나요?
                  </button>
                </div>

                <button
                  @click="handleLogin"
                  class="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-sm font-semibold text-white shadow-md transition hover:from-sky-400 hover:to-indigo-500"
                >
                  로그인
                </button>

                <div class="mt-4 flex items-center justify-center gap-1 text-[11px]">
                  <span class="text-slate-400">계정이 없으신가요?</span>
                  <RouterLink to="/signup" class="font-semibold text-sky-500 hover:text-sky-600">
                    회원가입
                  </RouterLink>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = () => {
  //
}
</script>
