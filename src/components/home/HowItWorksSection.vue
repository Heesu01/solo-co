<template>
  <section id="how" class="border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-6xl px-4 py-14">
      <div ref="headEl" class="max-w-2xl">
        <p class="text-[12px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
          how it works
        </p>
        <h2 class="mt-2 text-2xl font-black tracking-tight">3단계 여행 준비 흐름</h2>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">
          여행 프로젝트를 만들고 후보 장소를 모으면, AI가 날짜별 루트 초안을 자동으로 정리해줘요.<br />
          결과는 바로 수정해서 내 일정으로 저장할 수 있어요.
        </p>
      </div>

      <div class="mt-8 grid gap-4 md:grid-cols-3">
        <div ref="c1">
          <div
            class="group min-h-[340px] rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div
                class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
              </div>

              <div
                class="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-xs font-black text-white"
              >
                1
              </div>
            </div>

            <p class="mt-4 text-[15px] font-black text-slate-900">프로젝트 생성</p>
            <p class="mt-2 text-[13px] leading-relaxed text-slate-700">
              여행의 기본 정보를 먼저 정리해요
            </p>
            <p class="mt-2 text-[12px] leading-relaxed text-slate-600">
              날짜·지역·여행 방식(혼자/그룹)을 한 번에 설정해요
            </p>

            <div
              class="relative mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
            >
              <div v-if="step1Img">
                <img
                  :src="step1Img"
                  alt="프로젝트 생성 화면 예시"
                  class="h-[160px] w-full object-cover"
                />
              </div>
              <div v-else class="h-[160px] w-full">
                <div class="flex h-full items-center justify-center">
                  <img :src="step1Image" alt="프로젝트 생성 화면 예시" class="h-full" />
                </div>
                <div
                  class="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-slate-200/35 blur-2xl"
                ></div>
                <div
                  class="pointer-events-none absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-slate-200/35 blur-2xl"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div ref="c2">
          <div
            class="group min-h-[340px] rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div
                class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 21s7-4.4 7-11a7 7 0 10-14 0c0 6.6 7 11 7 11z" />
                  <path d="M12 10a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>

              <div
                class="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-xs font-black text-white"
              >
                2
              </div>
            </div>

            <p class="mt-4 text-[15px] font-black text-slate-900">장소 수집</p>
            <p class="mt-2 text-[13px] leading-relaxed text-slate-700">
              가고 싶은 곳을 지도에서 모아둬요
            </p>
            <p class="mt-2 text-[12px] leading-relaxed text-slate-600">
              구글맵 기반으로 후보를 저장하고, 우선순위를 정리해요
            </p>

            <div
              class="relative mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
            >
              <div v-if="step2Img">
                <img
                  :src="step2Img"
                  alt="장소 담기 화면 예시"
                  class="h-[160px] w-full object-cover"
                />
              </div>
              <div v-else class="h-[160px] w-full">
                <div class="flex h-full items-center justify-center">
                  <div class="text-center">
                    <img :src="step2Image" alt="프로젝트 생성 화면 예시" class="h-full" />
                  </div>
                </div>
                <div
                  class="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-slate-200/35 blur-2xl"
                ></div>
                <div
                  class="pointer-events-none absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-slate-200/35 blur-2xl"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div ref="c3">
          <div
            class="group min-h-[340px] rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div
                class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" />
                  <path d="M5 21h14" />
                </svg>
              </div>

              <div
                class="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-xs font-black text-white"
              >
                3
              </div>
            </div>

            <p class="mt-4 text-[15px] font-black text-slate-900">AI 일정 확인</p>
            <p class="mt-2 text-[13px] leading-relaxed text-slate-700">
              날짜별 루트 후보를 빠르게 받아봐요
            </p>
            <p class="mt-2 text-[12px] leading-relaxed text-slate-600">
              동선 흐름을 기준으로 초안을 만들고, 클릭 몇 번으로 편집해요
            </p>

            <div
              class="relative mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
            >
              <div v-if="step3Img">
                <img
                  :src="step3Img"
                  alt="AI 추천 결과 화면 예시"
                  class="h-[160px] w-full object-cover"
                />
              </div>
              <div v-else class="h-[160px] w-full">
                <div class="flex h-full items-center justify-center">
                  <div class="text-center">
                    <img :src="step3Image" alt="프로젝트 생성 화면 예시" class="h-full" />
                  </div>
                </div>
                <div
                  class="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-slate-200/35 blur-2xl"
                ></div>
                <div
                  class="pointer-events-none absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-slate-200/35 blur-2xl"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReveal } from '@/composables/useReveal'
import step1Image from '@/assets/home/one.png'
import step2Image from '@/assets/home/two.png'
import step3Image from '@/assets/home/three.png'

const step1Img = null
const step2Img = null
const step3Img = null

const headEl = ref(null)
const c1 = ref(null)
const c2 = ref(null)
const c3 = ref(null)
const footEl = ref(null)

const rHead = useReveal(headEl)
const rC1 = useReveal(c1, { delay: 0 })
const rC2 = useReveal(c2, { delay: 220 })
const rC3 = useReveal(c3, { delay: 440 })
const rFoot = useReveal(footEl, { delay: 560 })

onMounted(() => {
  rHead.mount()
  rC1.mount()
  rC2.mount()
  rC3.mount()
  rFoot.mount()
})
</script>
