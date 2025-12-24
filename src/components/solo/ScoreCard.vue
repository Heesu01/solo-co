<template>
  <section class="mb-5">
    <div class="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div class="p-5 md:p-6">
        <p class="text-[13px] font-semibold uppercase tracking-[0.18em] text-primary">solo score</p>

        <div class="mt-2 flex flex-wrap items-end gap-x-3 gap-y-2">
          <p class="text-[36px] leading-none font-extrabold tracking-tight text-slate-900">
            {{ scoreNum(meta?.totalScore) }}
          </p>
          <span class="pb-1 text-[12px] font-semibold text-slate-500">/ 100</span>

          <span
            class="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
            :class="totalChipClass"
          >
            {{ totalChipLabel }}
          </span>
        </div>

        <p class="mt-3 text-[13px] leading-relaxed text-slate-700">
          {{ meta?.summary || '추천 코스 요약이 표시됩니다.' }}
        </p>
        <p v-if="meta?.recommendation" class="mt-2 text-[12px] leading-relaxed text-slate-500">
          {{ meta.recommendation }}
        </p>
      </div>

      <div class="h-px bg-slate-200"></div>

      <details class="group" :open="open">
        <summary
          class="flex cursor-pointer select-none items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50"
          @click.prevent="toggle"
        >
          <div class="flex items-center gap-2">
            <span class="text-[13px] font-semibold text-slate-800">더보기</span>
            <span class="text-[11px] text-slate-500">
              각 장소의 위치·환경·이용 방식과 하루 동선을 기준으로, 혼자서도 무리 없이 즐길 수
              있는지 평가한 지표입니다.
            </span>
          </div>

          <div class="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-600">
            <span class="group-open:hidden">열기</span>
            <span class="hidden group-open:inline">닫기</span>
            <svg
              viewBox="0 0 24 24"
              class="h-4 w-4 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </summary>

        <div class="px-5 pb-5">
          <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              :open="open"
              label="안전성"
              :value="num(meta?.safety)"
              :reason="just.safety"
              hint="지역 치안·야간 안전·유흥 밀집도 등을 고려한 점수"
            />
            <MetricCard
              :open="open"
              label="교통 편의성"
              :value="num(meta?.transportAccessibility)"
              :reason="just.transportAccessibility"
              hint="지하철·버스 등 대중교통 접근성을 평가한 점수"
            />
            <MetricCard
              :open="open"
              label="경로 단순성"
              :value="num(meta?.routeSimplicity)"
              :reason="just.routeSimplicity"
              hint="이동 동선의 복잡도를 고려한 점수"
            />
            <MetricCard
              :open="open"
              label="관광지 접근성"
              :value="num(meta?.landmarkAccessibility)"
              :reason="just.landmarkAccessibility"
              hint="혼자서도 부담 없이 즐길 수 있는지를 평가한 점수"
            />
            <MetricCard
              :open="open"
              label="혼밥 난이도"
              :value="soloDiningEase"
              :reason="just.soloDiningDifficulty"
              hint="혼자 식사하기 쉬운 정도"
            />
          </div>
        </div>
      </details>
    </div>
  </section>
</template>

<script setup>
import { computed, defineComponent, h, ref, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({
  meta: { type: Object, default: () => ({}) },
  justification: { type: Object, default: () => ({}) },
})

const open = ref(false)
const toggle = () => (open.value = !open.value)

const scoreNum = (v) => {
  if (v == null) return '-'
  const n = Number(v)
  if (Number.isNaN(n)) return '-'
  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}
const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0
}
const invert100 = (v) => 100 - num(v)

const soloDiningEase = computed(() => invert100(props.meta?.soloDiningDifficulty))

const totalChipLabel = computed(() => {
  const s = Number(props.meta?.totalScore ?? 0)
  if (s >= 85) return '추천'
  if (s >= 70) return '무난'
  return '주의'
})

const totalChipClass = computed(() => {
  const s = Number(props.meta?.totalScore ?? 0)
  if (s >= 85) return 'bg-emerald-50 text-emerald-700'
  if (s >= 70) return 'bg-sky-50 text-sky-700'
  return 'bg-rose-50 text-rose-700'
})

const just = computed(() => props.meta?.scoreJustification || props.justification || {})

const MetricCard = defineComponent({
  name: 'MetricCard',
  props: {
    label: { type: String, required: true },
    value: { type: [Number, Object], default: 0 },
    reason: { type: String, default: '' },
    hint: { type: String, default: '' },
    duration: { type: Number, default: 700 },
    open: { type: Boolean, default: false },
  },
  setup(p) {
    const size = 56
    const stroke = 7
    const r = (size - stroke) / 2
    const c = 2 * Math.PI * r

    const finalValue = computed(() => {
      const raw = typeof p.value === 'object' && p.value?.value != null ? p.value.value : p.value
      const n = Number(raw ?? 0)
      return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0
    })

    const grade = computed(() => {
      const v = finalValue.value
      if (v >= 85) return 'good'
      if (v >= 70) return 'normal'
      return 'bad'
    })

    const colorSet = computed(() => {
      switch (grade.value) {
        case 'good':
          return {
            stroke: 'rgb(16 185 129)',
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-200/60',
          }
        case 'normal':
          return {
            stroke: 'rgb(56 189 248)',
            bg: 'bg-sky-50',
            text: 'text-sky-700',
            border: 'border-sky-200/60',
          }
        default:
          return {
            stroke: 'rgb(244 63 94)',
            bg: 'bg-rose-50',
            text: 'text-rose-700',
            border: 'border-rose-200/60',
          }
      }
    })

    const progress = ref(0)
    let rafId = null

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

    const run = async () => {
      if (rafId) cancelAnimationFrame(rafId)

      progress.value = 0
      await nextTick()

      const start = performance.now()
      const to = finalValue.value

      const step = (now) => {
        const t = Math.min(1, (now - start) / p.duration)
        progress.value = to * easeOutCubic(t)
        if (t < 1) rafId = requestAnimationFrame(step)
      }

      rafId = requestAnimationFrame(step)
    }

    watch(
      () => p.open,
      (v) => {
        if (v) run()
      },
      { flush: 'post' },
    )

    onBeforeUnmount(() => {
      if (rafId) cancelAnimationFrame(rafId)
    })

    const dash = computed(() => (c * progress.value) / 100)

    return () =>
      h(
        'div',
        {
          class: [
            'rounded-xl border px-4 py-3 transition-colors',
            'bg-white',
            colorSet.value.bg,
            colorSet.value.border,
          ],
        },
        [
          h('div', { class: 'flex items-start gap-3' }, [
            h('div', { class: 'relative mt-0.5 h-14 w-14 shrink-0' }, [
              h('svg', { width: size, height: size, viewBox: `0 0 ${size} ${size}` }, [
                h('circle', {
                  cx: size / 2,
                  cy: size / 2,
                  r,
                  fill: 'none',
                  stroke: 'rgb(226 232 240)',
                  'stroke-width': stroke,
                }),
                h('circle', {
                  cx: size / 2,
                  cy: size / 2,
                  r,
                  fill: 'none',
                  stroke: colorSet.value.stroke,
                  'stroke-width': stroke,
                  'stroke-linecap': 'round',
                  'stroke-dasharray': `${dash.value} ${c - dash.value}`,
                  transform: `rotate(-90 ${size / 2} ${size / 2})`,
                }),
              ]),
              h(
                'div',
                {
                  class: [
                    'absolute inset-0 flex items-center justify-center text-[13px] font-extrabold tabular-nums',
                    colorSet.value.text,
                  ],
                },
                String(Math.round(finalValue.value)),
              ),
            ]),

            h('div', { class: 'min-w-0 flex-1' }, [
              h('div', { class: 'flex items-center justify-between gap-2' }, [
                h('p', { class: 'text-[13px] font-semibold text-slate-900' }, p.label),
                h(
                  'span',
                  {
                    class: ['text-[12px] font-bold tabular-nums', colorSet.value.text],
                  },
                  String(Math.round(finalValue.value)),
                ),
              ]),

              p.hint ? h('p', { class: 'mt-0.5 text-[11px] text-slate-500' }, p.hint) : null,

              h(
                'p',
                { class: 'mt-1 line-clamp-2 text-[12px] leading-relaxed text-slate-700' },
                p.reason || '근거 데이터 없음',
              ),
            ]),
          ]),
        ],
      )
  },
})
</script>
