<template>
  <aside class="rounded-2xl border border-slate-200 bg-white">
    <div class="border-b border-slate-200 px-5 py-4">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        travel plan
      </p>
      <h2 class="mt-1 text-[16px] font-bold text-slate-900">담은 장소</h2>
      <p class="mt-1 text-[13px] text-slate-600">오른쪽에서 추가한 장소가 여기에 쌓입니다.</p>
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
            </p>
            <p
              class="mt-1 line-clamp-2 text-[12px]"
              :class="p.googlePlaceId === activePlaceId ? 'text-white/80' : 'text-slate-600'"
            >
              {{ p.address }}
            </p>
            <span
              class="mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
              :class="
                p.googlePlaceId === activePlaceId
                  ? 'bg-white/15 text-white'
                  : 'bg-slate-100 text-slate-600'
              "
            >
              {{ p.category ?? 'place' }}
            </span>
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
    <div class="border-t border-slate-200 px-5 py-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            ai routes
          </p>
          <h3 class="mt-1 text-[14px] font-bold text-slate-900">경로 추천</h3>
        </div>

        <button
          type="button"
          class="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          @click="$emit('requestAiRoutes')"
        >
          추천받기
        </button>
      </div>

      <div
        v-if="routeCandidates.length === 0"
        class="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600"
      >
        추천을 누르면 후보 경로가 여기에 뜹니다.
      </div>

      <div v-else class="mt-4 space-y-2">
        <button
          v-for="r in routeCandidates"
          :key="r.id"
          type="button"
          class="w-full rounded-xl border px-4 py-3 text-left transition"
          :class="
            r.id === selectedRouteId
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          "
          @click="$emit('selectRoute', r.id)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-[14px] font-bold">{{ r.title }}</p>
              <p
                class="mt-1 text-[12px]"
                :class="r.id === selectedRouteId ? 'text-white/80' : 'text-slate-600'"
              >
                {{ r.summary }} · {{ r.duration }}
              </p>
              <p
                class="mt-2 text-[12px]"
                :class="r.id === selectedRouteId ? 'text-white/80' : 'text-slate-600'"
              >
                {{ r.stops?.join(' → ') }}
              </p>
            </div>

            <span
              class="shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold"
              :class="
                r.id === selectedRouteId ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600'
              "
            >
              선택
            </span>
          </div>
        </button>
      </div>

      <div v-if="selectedRouteId" class="mt-3 text-[12px] text-slate-500">
        선택된 경로: <span class="font-semibold text-slate-700">{{ selectedRouteId }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  places: { type: Array, default: () => [] },

  activePlaceId: { type: String, default: null },

  routeCandidates: { type: Array, default: () => [] },
  selectedRouteId: { type: String, default: null },
})

defineEmits(['selectPlace', 'removePlace', 'requestAiRoutes', 'selectRoute'])
</script>
