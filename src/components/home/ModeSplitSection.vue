<template>
  <section id="modes" class="border-t border-slate-200 bg-slate-50">
    <div class="mx-auto max-w-6xl px-4 py-14">
      <div ref="headEl" class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div class="max-w-2xl">
          <p class="text-[12px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
            choose your mode
          </p>
          <h2 class="mt-2 text-2xl font-black tracking-tight">여행 방식 선택</h2>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">
            혼자 여행은 안전과 동선 중심으로, 같이 여행은 합의 과정을 한 번에 정리해요.
          </p>
        </div>

        <button
          class="cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          @click="scrollTo('start')"
        >
          지금 시작하기
        </button>
      </div>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <div ref="soloEl">
          <button
            type="button"
            class="cursor-pointer group w-full rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-sm"
            @click="go('/solo')"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white"
                  >
                    SOLO
                  </span>
                  <span
                    class="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                  >
                    안전 우선
                  </span>
                  <span
                    class="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                  >
                    난이도 지수
                  </span>
                </div>

                <p class="mt-3 text-lg font-black text-slate-900">혼자 여행</p>
                <p class="mt-2 text-[13px] leading-relaxed text-slate-600">
                  혼자여행 난이도와 안전 경로를 기준으로, 더 안심되는 일정 흐름을 만들어요.
                </p>
              </div>

              <div
                class="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 md:flex"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
                </svg>
              </div>
            </div>

            <div class="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <div class="relative">
                <div
                  class="flex h-[180px] w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="h-6 w-6 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <rect x="3" y="3" width="18" height="14" rx="2" />
                    <path d="M3 13l4-4 4 3 5-5 5 6" />
                  </svg>

                  <p class="mt-2 text-[12px] font-semibold text-slate-500">화면 이미지</p>
                  <p class="mt-0.5 text-[11px] text-slate-400">나중에 스샷</p>
                </div>

                <div
                  class="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-white/40 blur-2xl"
                ></div>
                <div
                  class="pointer-events-none absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-white/40 blur-2xl"
                ></div>
              </div>
            </div>

            <ul class="mt-5 space-y-2">
              <li class="flex items-start gap-2 text-[12px] text-slate-700">
                <span
                  class="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p class="font-semibold">난이도 지수</p>
                  <p class="mt-0.5 text-slate-500">혼밥/이동/치안/동선 복잡도를 한 번에 보여줘요</p>
                </div>
              </li>

              <li class="flex items-start gap-2 text-[12px] text-slate-700">
                <span
                  class="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p class="font-semibold">안전 경로 추천</p>
                  <p class="mt-0.5 text-slate-500">야간 이동/혼잡 구간을 피하는 루트를 제안해요</p>
                </div>
              </li>

              <li class="flex items-start gap-2 text-[12px] text-slate-700">
                <span
                  class="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p class="font-semibold">개인 일정 편집</p>
                  <p class="mt-0.5 text-slate-500">AI 초안을 기준으로 내 취향대로 바로 수정해요</p>
                </div>
              </li>
            </ul>

            <div
              class="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white group-hover:bg-slate-800"
            >
              Solo로 시작
              <svg
                viewBox="0 0 24 24"
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </button>
        </div>

        <div ref="groupEl">
          <button
            type="button"
            class="cursor-pointer group w-full rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-sm"
            @click="go('/group')"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white"
                  >
                    GROUP
                  </span>
                  <span
                    class="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                  >
                    초대 링크
                  </span>
                  <span
                    class="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                  >
                    투표 & 댓글
                  </span>
                </div>

                <p class="mt-3 text-lg font-black text-slate-900">같이 여행</p>
                <p class="mt-2 text-[13px] leading-relaxed text-slate-600">
                  초대부터 투표·댓글까지, 합의 과정을 한 공간에서 정리해요.
                </p>
              </div>

              <div
                class="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 md:flex"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" />
                </svg>
              </div>
            </div>

            <div class="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <div class="relative">
                <div
                  class="flex h-[180px] w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="h-6 w-6 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <rect x="3" y="3" width="18" height="14" rx="2" />
                    <path d="M3 13l4-4 4 3 5-5 5 6" />
                  </svg>

                  <p class="mt-2 text-[12px] font-semibold text-slate-500">화면 이미지</p>
                  <p class="mt-0.5 text-[11px] text-slate-400">나중에 스샷</p>
                </div>

                <div
                  class="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-white/40 blur-2xl"
                ></div>
                <div
                  class="pointer-events-none absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-white/40 blur-2xl"
                ></div>
              </div>
            </div>

            <ul class="mt-5 space-y-2">
              <li class="flex items-start gap-2 text-[12px] text-slate-700">
                <span
                  class="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p class="font-semibold">초대 링크</p>
                  <p class="mt-0.5 text-slate-500">링크 공유만으로 멤버 참여를 빠르게 열어요</p>
                </div>
              </li>

              <li class="flex items-start gap-2 text-[12px] text-slate-700">
                <span
                  class="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p class="font-semibold">투표로 일정 결정</p>
                  <p class="mt-0.5 text-slate-500">말로만 정하던 부분을 투표로 깔끔하게 정리해요</p>
                </div>
              </li>

              <li class="flex items-start gap-2 text-[12px] text-slate-700">
                <span
                  class="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p class="font-semibold">댓글로 합의 기록</p>
                  <p class="mt-0.5 text-slate-500">결정 이유와 변경 기록이 남아서 혼선이 줄어요</p>
                </div>
              </li>
            </ul>

            <div
              class="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white group-hover:bg-slate-800"
            >
              Group으로 시작
              <svg
                viewBox="0 0 24 24"
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </button>
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

const scrollTo = (id) => {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const headEl = ref(null)
const soloEl = ref(null)
const groupEl = ref(null)

const rHead = useReveal(headEl)
const rSolo = useReveal(soloEl, { delay: 0 })
const rGroup = useReveal(groupEl, { delay: 180 })

onMounted(() => {
  rHead.mount()
  rSolo.mount()
  rGroup.mount()
})
</script>
