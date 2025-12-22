<template>
  <aside class="rounded-2xl border border-slate-200 bg-white">
    <div class="border-b border-slate-200 px-5 py-4 pb-3">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        travel plan
      </p>
      <h2 class="mt-1 text-[16px] font-bold text-slate-900">담은 장소</h2>
      <p class="text-[13px] text-slate-600">오른쪽에서 추가한 장소가 여기에 쌓입니다.</p>
    </div>

    <!-- 장소 목록 -->
    <div class="max-h-[420px] overflow-auto px-2 py-2">
      <div v-if="places.length === 0" class="p-6 text-center text-sm text-slate-500">
        담은 장소가 없습니다.
      </div>

      <button
        v-for="p in places"
        :key="p.googlePlaceId ?? p.placeId"
        type="button"
        class="cursor-pointer group mb-2 w-full rounded-xl border px-4 py-3 text-left transition"
        :class="
          p.googlePlaceId === activePlaceId
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-slate-200 bg-white hover:bg-slate-50'
        "
        @click="$emit('selectPlace', p.googlePlaceId)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="truncate text-[14px] font-bold">
              {{ p.name }}
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                :class="
                  p.googlePlaceId === activePlaceId
                    ? 'bg-white/15 text-white'
                    : 'bg-slate-100 text-slate-600'
                "
              >
                {{ p.category ?? 'place' }}
              </span>
            </p>
            <p
              class="mt-1 line-clamp-2 text-[12px]"
              :class="p.googlePlaceId === activePlaceId ? 'text-white/80' : 'text-slate-600'"
            >
              {{ p.address }}
            </p>
          </div>

          <button
            type="button"
            class="cursor-pointer shrink-0 rounded-lg px-2 py-1 text-[12px] font-semibold"
            :class="
              p.googlePlaceId === activePlaceId
                ? 'text-white/90 hover:bg-white/10'
                : 'text-slate-500 hover:bg-slate-100'
            "
            @click.stop="$emit('removePlace', p.placeId)"
          >
            삭제
          </button>
        </div>
      </button>
    </div>

    <!-- AI 추천 경로 -->
    <div class="border-t border-slate-200 px-5 py-4 relative">
      <div class="space-y-4">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            ai routes
          </p>
          <h3 class="mt-1 text-[14px] font-bold text-slate-900">경로 추천</h3>
          <p class="mt-1 text-[12px] text-slate-600">
            담은 장소를 기반으로 AI가 날짜별 후보 경로를 생성합니다.
          </p>
        </div>

        <div class="absolute top-5 right-5">
          <button
            type="button"
            class="cursor-pointer h-8 min-w-[120px] rounded-xl bg-gradient-to-r from-start to-end px-5 text-sm font-semibold text-white shadow-md transition hover:from-start-hover hover:to-end-hover disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="aiLoading"
            @click="$emit('requestAiRoutes')"
          >
            <span v-if="aiLoading">생성중…</span>
            <span v-else>추천받기</span>
          </button>
        </div>
      </div>

      <div v-if="aiLoading" class="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        AI가 코스를 만들고 있어요… 잠시만 기다려주세요.
      </div>
      <div
        v-else-if="aiError"
        class="mt-4 rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700"
      >
        {{ aiError }}
      </div>

      <div
        v-else-if="routeCandidates.length === 0"
        class="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600"
      >
        추천을 누르면 후보 경로가 여기에 뜹니다.
      </div>

      <!-- 후보 리스트 -->
      <div v-else class="mt-4 space-y-2">
        <p class="mt-1 text-[12px] text-slate-600">
          저장을 하면 프로젝트 경로에 추가돼 더 상세하게 보거나 수정할 수 있습니다.
        </p>
        <div
          v-for="c in routeCandidates"
          :key="c.routeType"
          class="rounded-xl border border-slate-200 bg-white p-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-[14px] font-bold text-slate-900">코스 {{ c.routeType }}</p>

                <span
                  v-if="c.soloScore?.totalScore != null"
                  class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                >
                  총점 {{ c.soloScore.totalScore }}
                </span>

                <span
                  v-if="c.soloScore?.safety != null"
                  class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
                >
                  안전 {{ c.soloScore.safety }}
                </span>

                <span
                  v-if="c.soloScore?.routeSimplicity != null"
                  class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
                >
                  동선 {{ c.soloScore.routeSimplicity }}
                </span>
              </div>

              <p v-if="c.summary" class="mt-2 text-[12px] text-slate-700">
                {{ c.summary }}
              </p>

              <p v-if="c.recommendation" class="mt-1 text-[12px] text-slate-600">
                {{ c.recommendation }}
              </p>
            </div>

            <button
              type="button"
              class="cursor-pointer shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="applyingRouteType != null"
              @click="$emit('applyAiRoute', c.routeType)"
            >
              <span v-if="applyingRouteType === c.routeType">저장중…</span>
              <span v-else>저장</span>
            </button>
          </div>

          <div class="mt-3 space-y-2">
            <div v-for="d in c.days" :key="d.day" class="rounded-lg bg-slate-50 px-3 py-2">
              <div class="flex items-center justify-between">
                <p class="text-[12px] font-semibold text-slate-700">DAY {{ d.day }}</p>
                <span class="text-[11px] font-semibold text-slate-500">
                  {{ d.places?.length ?? 0 }}곳
                </span>
              </div>

              <p class="mt-1 text-[12px] text-slate-600">
                {{ dayLine(d) }}
              </p>

              <div v-if="dayThumbs(d).length" class="mt-2 flex gap-2 overflow-x-auto pb-1">
                <img
                  v-for="(src, idx) in dayThumbs(d)"
                  :key="src + idx"
                  :src="src"
                  alt="thumb"
                  class="h-16 w-20 shrink-0 rounded-lg border border-slate-200 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div v-if="hasNewPlace(c)" class="mt-3 text-[11px] font-semibold text-slate-500">
            * 코스4는 새롭게 추천된 장소가 포함돼요.
          </div>
        </div>

        <div
          v-if="applyError"
          class="rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700"
        >
          {{ applyError }}
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  places: { type: Array, default: () => [] },
  activePlaceId: { type: String, default: null },

  routeCandidates: { type: Array, default: () => [] },

  aiLoading: { type: Boolean, default: false },
  aiError: { type: String, default: '' },

  applyingRouteType: { type: [Number, String], default: null },
  applyError: { type: String, default: '' },
})

defineEmits(['selectPlace', 'removePlace', 'requestAiRoutes', 'applyAiRoute'])

const dayLine = (dayObj) => {
  const places = Array.isArray(dayObj?.places) ? dayObj.places : []
  return places
    .map((p) => p?.placeName ?? '')
    .filter(Boolean)
    .join(' → ')
}

const dayThumbs = (dayObj) => {
  const places = Array.isArray(dayObj?.places) ? dayObj.places : []
  return places
    .map((p) => p?.thumbnail)
    .filter(Boolean)
    .slice(0, 6)
}

const hasNewPlace = (candidate) => {
  const days = Array.isArray(candidate?.days) ? candidate.days : []
  return days.some((d) => (Array.isArray(d?.places) ? d.places : []).some((p) => p?.newPlace))
}
</script>
