<template>
  <div class="bg-slate-50">
    <div class="mx-auto max-w-6xl px-4 pt-20 pb-16 md:pt-15">
      <div class="relative overflow-visible">
        <img
          src="@/assets/bg-login.svg"
          alt="decor background"
          class="pointer-events-none absolute left-80 top-100 w-[750px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70"
        />
        <img
          src="@/assets/bg-signup.svg"
          alt="decor background"
          class="pointer-events-none absolute left-40 top-60 w-[750px] max-w-none -translate-x-1/2 -translate-y-1/2"
        />

        <div
          class="relative grid gap-10 px-8 py-10 md:grid-cols-2 md:gap-16 md:px-12 lg:px-20 lg:py-16"
        >
          <section class="flex flex-col justify-center gap-8">
            <div class="space-y-4">
              <p class="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                solo&co travel planner
              </p>
              <h1
                class="text-3xl font-title leading-tight text-slate-900 md:text-4xl lg:text-[40px]"
              >
                회원가입하고<br />
                시작하세요!
              </h1>
              <p class="text-sm leading-relaxed text-slate-500 md:text-[15px]">
                Solo&Co에 가입하면 혼자 떠나는 여행부터 <br class="hidden md:block" />친구들과
                함께하는 단체 여행까지<br class="hidden md:block" />
                하나의 계정으로 일정, 장소, 난이도까지 한 번에 관리할 수 있어요.
              </p>
            </div>

            <div class="mt-2">
              <img
                src="@/assets/character-signup.svg"
                alt="회원가입 캐릭터"
                class="ml-4 w-52 max-w-xs drop-shadow-[0_18px_35px_rgba(15,23,42,0.25)] md:w-60"
              />
            </div>
          </section>

          <section class="flex items-center justify-center md:justify-end">
            <div class="flex w-full items-center justify-end">
              <div
                class="relative z-10 w-full max-w-md rounded-3xl bg-white/95 p-7 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur"
              >
                <div class="mb-6 space-y-1">
                  <div class="flex items-center justify-between gap-3">
                    <div class="text-lg font-semibold text-slate-800">Solo&Co 회원가입</div>
                    <img
                      src="@/assets/logo.svg"
                      alt="Solo&Co Logo"
                      class="h-8 w-auto object-contain"
                    />
                  </div>
                  <p class="text-[11px] text-slate-400">
                    하나의 계정으로 개인/그룹 여행 프로젝트를 모두 관리할 수 있어요.
                  </p>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-medium text-slate-600">아이디</label>
                  <input
                    v-model="username"
                    type="text"
                    placeholder="사용하실 아이디를 입력해주세요 (6~20자)"
                    class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div class="mt-4 space-y-2">
                  <label class="text-xs font-medium text-slate-600">이메일</label>
                  <input
                    v-model="email"
                    type="email"
                    placeholder="이메일 주소를 입력해주세요"
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
                      placeholder="영문, 숫자, 특수문자 포함 8~20자"
                      class="w-full bg-transparent text-sm outline-none"
                    />
                    <button
                      type="button"
                      class="ml-2 w-10 text-xs text-slate-400 hover:text-slate-600"
                      @click="togglePassword"
                    >
                      {{ showPassword ? '숨기기' : '보기' }}
                    </button>
                  </div>
                </div>

                <div class="mt-3 space-y-2">
                  <label class="text-xs font-medium text-slate-600">비밀번호 확인</label>
                  <input
                    v-model="confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="비밀번호를 한 번 더 입력해주세요"
                    class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                  <p v-if="passwordMismatch" class="text-[11px] text-rose-500">
                    비밀번호가 일치하지 않습니다.
                  </p>
                </div>

                <div class="mt-4 gap-3">
                  <label class="text-xs font-medium text-slate-600">이름</label>
                  <input
                    v-model="name"
                    type="text"
                    placeholder="이름"
                    class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div class="mt-5 space-y-2">
                  <label class="text-xs font-medium text-slate-600">약관 동의</label>
                  <div
                    class="space-y-2 rounded-2xl bg-slate-50/60 p-3 text-[11px] text-slate-500 border border-slate-200"
                  >
                    <label class="flex cursor-pointer items-center gap-2">
                      <input
                        v-model="agreeAll"
                        type="checkbox"
                        class="h-4 w-4 rounded border-slate-300"
                      />
                      <span class="font-medium text-slate-700">모두 동의합니다</span>
                    </label>
                    <div class="pl-5 space-y-1">
                      <label class="flex cursor-pointer items-center gap-2">
                        <input
                          v-model="agreeService"
                          type="checkbox"
                          class="h-3.5 w-3.5 rounded border-slate-300"
                        />
                        <span>[필수] 서비스 이용약관 동의</span>
                      </label>
                      <label class="flex cursor-pointer items-center gap-2">
                        <input
                          v-model="agreePrivacy"
                          type="checkbox"
                          class="h-3.5 w-3.5 rounded border-slate-300"
                        />
                        <span>[필수] 개인정보 수집 및 이용 동의</span>
                      </label>
                      <label class="flex cursor-pointer items-center gap-2">
                        <input
                          v-model="agreeMarketing"
                          type="checkbox"
                          class="h-3.5 w-3.5 rounded border-slate-300"
                        />
                        <span>[선택] 마케팅 정보 수신 동의</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-start to-end text-sm font-semibold text-white shadow-md transition hover:from-start-hover hover:to-end-hover disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="!canSubmit"
                  @click="handleSignup"
                >
                  가입하기
                </button>

                <div class="mt-4 flex items-center justify-center gap-1 text-[11px]">
                  <span class="text-slate-400">이미 Solo&Co 계정이 있으신가요?</span>
                  <RouterLink to="/login" class="font-semibold text-sky-500 hover:text-sky-600">
                    로그인
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
import { computed, ref, watch } from 'vue'
import { signup } from '@/api/auth'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')

const showPassword = ref(false)

const agreeAll = ref(false)
const agreeService = ref(false)
const agreePrivacy = ref(false)
const agreeMarketing = ref(false)

const router = useRouter()

watch(agreeAll, (val) => {
  if (val) {
    agreeService.value = true
    agreePrivacy.value = true
    agreeMarketing.value = true
  }
})

watch([agreeService, agreePrivacy, agreeMarketing], ([s, p, m]) => {
  if (s && p && m) {
    agreeAll.value = true
  } else if (!s || !p) {
    agreeAll.value = false
  }
})

const passwordMismatch = computed(
  () => confirmPassword.value.length > 0 && password.value !== confirmPassword.value,
)

const canSubmit = computed(() => {
  return (
    username.value.trim().length >= 6 &&
    email.value.trim().length > 0 &&
    password.value.length >= 8 &&
    !passwordMismatch.value &&
    agreeService.value &&
    agreePrivacy.value
  )
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleSignup = async () => {
  if (!canSubmit.value) return

  try {
    const res = await signup({
      username: username.value,
      password: password.value,
      email: email.value,
      name: name.value,
    })

    console.log('회원가입 성공:', res)

    router.push('/login')
  } catch (error) {
    alert(error.response?.data?.message || '회원가입에 실패했습니다.')
  }
}
</script>
