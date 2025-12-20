<template>
  <section class="relative overflow-hidden mt-10">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -left-24 top-20 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl"></div>
      <div class="absolute -right-24 top-10 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl"></div>
      <div
        class="absolute left-1/2 top-[340px] h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl"
      ></div>
    </div>

    <div class="mx-auto max-w-6xl px-4 pt-16 pb-12 md:pt-20 md:pb-16">
      <div class="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p class="text-[12px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
            solo&co · travel planner
          </p>

          <h1 class="mt-4 text-3xl font-title leading-[1.15] tracking-tight md:text-4xl">
            <span class="text-primary"> 여행 프로젝트</span>를 만들고<br />
            <span class="text-slate-900">장소를 담아</span>
            <span class="text-primary"> AI로 일정</span>을 완성한다
          </h1>

          <p class="mt-4 text-[14px] leading-relaxed text-slate-600">
            Solo&Co에서는 여행을 프로젝트로 만들고, 가고 싶은 장소만 담으면 AI가 날짜별 일정 후보를
            만들어줘요. 혼자 여행할 때는 이동 난이도와 안전 경로를 확인할 수 있고, 같이 가는 여행은
            초대·투표·댓글로 일정을 쉽게 정할 수 있어요.
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <button
              class="cursor-pointer rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              @click="go('/signup')"
            >
              여행 시작하기
            </button>
            <button
              class="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              @click="scrollTo('how')"
            >
              어떻게 쓰나요?
            </button>
          </div>

          <div class="mt-7 grid grid-cols-3 gap-3">
            <StatCard title="프로젝트 만들기" desc="여행을 한 번에 정리해요" />
            <StatCard title="AI 일정 추천" desc="날짜별 루트를 뽑아줘요" />
            <StatCard title="함께 결정" desc="초대·투표·댓글로요" />
          </div>
        </div>

        <div class="relative">
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <p class="font-sub font-semibold text-slate-700">이번 여행 프로젝트</p>
              <span
                class="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600"
              >
                PREVIEW
              </span>
            </div>

            <div class="mt-4 space-y-3">
              <MockRow icon="map" title="장소 담기" desc="지도에서 후보 장소를 추가해요" />
              <MockRow icon="ai" title="AI 일정 생성" desc="날짜·취향 기준으로 추천받아요" />
              <MockRow icon="shield" title="안전 체크" desc="혼자 여행이면 더 안심돼요" />
              <MockRow icon="chat" title="투표 & 댓글" desc="같이 가는 여행은 합의가 쉬워요" />
            </div>

            <div class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-[12px] font-semibold text-slate-800">추천 결과 예시</p>
              <p class="mt-1 text-[12px] text-slate-600">
                1일차 · 서면 → 광안리 → 해운대 (도보+대중교통, 안전 우선)
              </p>
            </div>
          </div>

          <div
            class="pointer-events-none absolute -bottom-8 -right-6 hidden w-[220px] rotate-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:block"
          >
            <p class="text-[11px] font-semibold text-slate-700 font-sub">혼자여행 난이도</p>
            <div class="mt-3 space-y-2">
              <div class="h-2 w-full rounded-full bg-slate-100">
                <div class="h-2 w-[72%] rounded-full bg-slate-900"></div>
              </div>
              <p class="text-[11px] text-slate-500">이동·치안·혼밥·동선 복잡도 기반</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const go = (path) => router.push(path)

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const StatCard = {
  props: { title: String, desc: String },
  template: `
    <div class="rounded-xl border border-slate-200 bg-white p-3">
      <p class="text-[12px] font-black text-slate-900">{{ title }}</p>
      <p class="mt-0.5 text-[11px] text-slate-500">{{ desc }}</p>
    </div>
  `,
}

const MockRow = {
  props: { icon: String, title: String, desc: String },
  computed: {
    iconSvg() {
      const icons = {
        map: `<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z"/><path d="M9 3v15"/><path d="M15 6v15"/></svg>`,
        ai: `<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l1.2 4.5L18 8l-4.8 1.5L12 14l-1.2-4.5L6 8l4.8-1.5L12 2z"/><path d="M5 21h14"/></svg>`,
        shield: `<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"/></svg>`,
        chat: `<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z"/></svg>`,
      }
      return icons[this.icon] || icons.ai
    },
  },
  template: `
    <div class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <div class="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-700" v-html="iconSvg"></div>
      <div class="min-w-0">
        <p class="text-[12px] font-black text-slate-900">{{ title }}</p>
        <p class="mt-0.5 text-[11px] text-slate-600">{{ desc }}</p>
      </div>
    </div>
  `,
}
</script>
