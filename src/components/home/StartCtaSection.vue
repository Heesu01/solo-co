<template>
  <section id="start" class="border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-6xl px-4 py-14">
      <div ref="ctaEl" class="rounded-2xl bg-white p-7 md:p-9">
        <div class="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div class="max-w-2xl">
            <p class="text-[12px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
              get started
            </p>

            <h3 class="mt-2 text-xl font-semibold tracking-tight text-slate-900">
              첫 여행 프로젝트를 만들어볼까요?
            </h3>

            <p class="mt-2 text-[13px] leading-relaxed text-slate-600">
              프로젝트를 만들고 장소를 담으면, AI가 날짜별 루트 초안을 정리해줘요. 초안은 원하는
              대로 편집해서 저장할 수 있어요.
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span
                class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] text-slate-700"
              >
                프로젝트 생성
              </span>
              <span
                class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] text-slate-700"
              >
                장소 담기
              </span>
              <span
                class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] text-slate-700"
              >
                AI 초안 확인
              </span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              class="cursor-pointer rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              @click="go('/signup')"
            >
              회원가입
            </button>

            <button
              class="cursor-pointer rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              @click="go('/login')"
            >
              로그인
            </button>
          </div>
        </div>

        <div class="mt-6 border-t border-slate-100 pt-4 text-[12px] text-slate-500">
          이미 계정이 있으면 로그인 후 바로 프로젝트를 생성할 수 있어요.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReveal } from '@/composables/useReveal'

const router = useRouter()
const go = (path) => router.push(path)

const ctaEl = ref(null)
const rCta = useReveal(ctaEl, { delay: 120 })

onMounted(() => {
  rCta.mount()
})
</script>
