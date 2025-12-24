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
            ? 'border-slate-900 bg-slate-800 text-white'
            : 'border-slate-200 bg-white hover:bg-slate-50'
        "
        @click="$emit('selectPlace', p.googlePlaceId)"
      >
        <div class="flex items-start gap-3">
          <div
            class="h-14 w-14 shrink-0 overflow-hidden rounded-lg border"
            :class="p.googlePlaceId === activePlaceId ? 'border-white/20' : 'border-slate-200'"
          >
            <img
              v-if="p.thumbnail"
              :src="p.thumbnail"
              alt="thumbnail"
              class="h-full w-full object-cover"
              loading="lazy"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-slate-100 text-[11px] text-slate-400"
            >
              no image
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-3">
              <p class="min-w-0 truncate text-[14px] font-bold">
                {{ p.placeName ?? p.name }}
                <span
                  class="ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  :class="
                    p.googlePlaceId === activePlaceId
                      ? 'bg-white/15 text-white'
                      : 'bg-slate-100 text-slate-600'
                  "
                >
                  {{ p.placeType ?? p.category ?? 'place' }}
                </span>
              </p>

              <button
                type="button"
                class="cursor-pointer shrink-0 rounded-lg px-2 py-0.5 text-[12px] font-semibold"
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

            <p
              class="mt-1 line-clamp-2 text-[12px] leading-relaxed break-words"
              :class="p.googlePlaceId === activePlaceId ? 'text-white/80' : 'text-slate-600'"
            >
              {{ p.placeAddress ?? p.address }}
            </p>
          </div>
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
          <h3 class="mt-1 text-[14px] font-bold text-slate-900">일정 추천</h3>
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
          코스를 선택하면 지도에서 순서 마커로 미리 볼 수 있어요. <br />저장하면 프로젝트 일정에
          추가됩니다.
        </p>

        <div
          v-for="c in routeCandidates"
          :key="c.routeType"
          class="rounded-xl border p-4 transition cursor-pointer"
          :class="
            c.routeType === activeCandidateRouteType
              ? 'border-slate-900 bg-slate-900/5'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          "
          @click="$emit('previewAiCandidate', c.routeType)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-[14px] font-bold text-slate-900">코스 {{ c.routeType }}</p>

                <span
                  v-if="c.soloScore?.totalScore != null"
                  class="inline-flex items-center rounded-full bg-primary-bg border border-light text-primary px-2 py-0.5 text-[11px] font-semibold"
                >
                  총점 {{ c.soloScore.totalScore }}
                </span>

                <button
                  type="button"
                  class="ml-auto cursor-pointer shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="applyingRouteType != null"
                  @click.stop="$emit('applyAiRoute', c.routeType)"
                >
                  <span v-if="applyingRouteType === c.routeType">저장중…</span>
                  <span v-else>저장</span>
                </button>
              </div>

              <p v-if="c.summary" class="mt-2 text-[12px] text-slate-700">
                {{ c.summary }}
              </p>

              <!-- <p v-if="c.recommendation" class="mt-1 text-[12px] text-slate-600">
                {{ c.recommendation }}
              </p> -->
            </div>
          </div>

          <!-- 솔로 추가정보 -->
          <div v-if="!hideCandidateDetail" class="mt-3">
            <button
              type="button"
              class="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
              @click.stop="toggleCandidateDetail(c.routeType)"
            >
              <span>{{ openDetailRouteType === c.routeType ? '상세 닫기' : '상세 보기' }}</span>
              <span class="text-slate-400">· 점수 산출 근거 / 추가 이유</span>
            </button>

            <div
              v-if="openDetailRouteType === c.routeType"
              class="mt-2 space-y-2 rounded-xl border border-slate-200 bg-white p-3"
            >
              <div v-if="c.reason" class="rounded-lg bg-white p-3">
                <p class="text-[11px] font-semibold text-slate-500">새 장소 추가 이유</p>
                <p
                  class="mt-1 text-[12px] leading-relaxed text-slate-700 bg-slate-50 p-2 rounded-lg"
                >
                  {{ c.reason }}
                </p>
              </div>

              <div v-if="c.soloScore?.scoreJustification" class="rounded-lg bg-white p-3">
                <p class="text-[11px] font-semibold text-slate-500">점수 산출 근거</p>

                <ul class="mt-2 space-y-2">
                  <li
                    v-for="item in scoreJustificationList(c)"
                    :key="item.key"
                    class="rounded-lg bg-slate-50 p-2"
                  >
                    <div class="flex items-center justify-between">
                      <p class="text-[12px] font-bold text-slate-700">{{ item.label }}</p>
                      <span
                        class="rounded-full bg-primary-bg border border-light text-primary px-2 py-0.5 text-[11px] font-semibold"
                      >
                        {{ item.value }}
                      </span>
                    </div>
                    <p class="mt-1 text-[12px] leading-relaxed text-slate-600">
                      {{ item.text }}
                    </p>
                  </li>
                </ul>
              </div>

              <div
                v-if="!c.reason && !scoreJustificationList(c).length"
                class="rounded-lg bg-white p-3 text-[12px] text-slate-500"
              >
                표시할 상세 정보가 없습니다.
              </div>
            </div>
          </div>
          <div
            v-if="
              c.routeType === activeCandidateRouteType && Array.isArray(c.days) && c.days.length
            "
            class="mt-3 flex flex-wrap gap-2"
          >
            <button
              v-for="d in c.days"
              :key="d.day"
              type="button"
              class="cursor-pointer rounded-full border px-3 py-1 text-[12px] font-semibold transition"
              :class="
                d.day === activeCandidateDay
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              "
              @click.stop="$emit('previewAiDay', { routeType: c.routeType, day: d.day })"
            >
              DAY {{ d.day }}
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
            * 새롭게 추천된 장소가 포함됐습니다.
          </div>
        </div>

        <div
          v-if="applyError"
          class="mt-2 rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700"
        >
          {{ applyError }}
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const hideCandidateDetail = computed(() => route.path.includes('/group'))

defineProps({
  places: { type: Array, default: () => [] },
  activePlaceId: { type: String, default: null },

  routeCandidates: { type: Array, default: () => [] },

  aiLoading: { type: Boolean, default: false },
  aiError: { type: String, default: '' },

  applyingRouteType: { type: [Number, String], default: null },
  applyError: { type: String, default: '' },

  activeCandidateRouteType: { type: [Number, null], default: null },
  activeCandidateDay: { type: [Number, null], default: 1 },
})

defineEmits([
  'selectPlace',
  'removePlace',
  'requestAiRoutes',
  'applyAiRoute',
  'previewAiCandidate',
  'previewAiDay',
])

const openDetailRouteType = ref(null)

const toggleCandidateDetail = (routeType) => {
  openDetailRouteType.value = openDetailRouteType.value === routeType ? null : routeType
}

const scoreJustificationList = (c) => {
  const s = c?.soloScore || {}
  const j = s?.scoreJustification || {}

  return [
    { key: 'safety', label: '치안', value: s.safety, text: j.safety },
    {
      key: 'transportAccessibility',
      label: '교통',
      value: s.transportAccessibility,
      text: j.transportAccessibility,
    },
    { key: 'routeSimplicity', label: '동선', value: s.routeSimplicity, text: j.routeSimplicity },
    {
      key: 'landmarkAccessibility',
      label: '관광지 접근성',
      value: s.landmarkAccessibility,
      text: j.landmarkAccessibility,
    },
    {
      key: 'soloDiningDifficulty',
      label: '혼밥 난이도',
      value: s.soloDiningDifficulty,
      text: j.soloDiningDifficulty,
    },
  ].filter((it) => it.value != null && it.text)
}

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
