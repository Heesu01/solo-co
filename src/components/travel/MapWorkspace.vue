<template>
  <section class="rounded-2xl border border-slate-200 bg-white">
    <div class="border-b border-slate-200 px-5 py-4">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">search</p>
      <h2 class="mt-1 text-[16px] font-bold text-slate-900">지도 · 장소 검색</h2>

      <div class="mt-4 flex gap-2">
        <input
          :value="query"
          type="text"
          placeholder="장소를 검색해보자 (예: 성수 카페)"
          class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          @input="$emit('updateQuery', $event.target.value)"
          @keydown.enter.prevent="$emit('search')"
        />
        <button
          type="button"
          class="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          @click="$emit('search')"
        >
          검색
        </button>
      </div>
    </div>

    <div class="grid gap-5 p-5 lg:grid-cols-[1fr,360px]">
      <div class="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <p class="text-sm font-semibold text-slate-800">지도</p>
          <span class="text-[12px] text-slate-500">마커 클릭 → 왼쪽 선택</span>
        </div>

        <div class="h-[520px] w-full">
          <GoogleMap
            :center="mapCenter"
            :markers="mapMarkers"
            :active-id="activeId"
            @markerClick="(id) => $emit('selectPlace', id)"
          />
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-2xl border border-slate-200 bg-white">
          <div class="border-b border-slate-200 px-4 py-3">
            <p class="text-sm font-semibold text-slate-800">검색 결과</p>
            <p class="mt-1 text-[12px] text-slate-500">클릭하면 상세를 보여준다.</p>
          </div>

          <div class="max-h-[260px] overflow-auto p-2">
            <div v-if="results.length === 0" class="p-6 text-center text-sm text-slate-500">
              검색 결과가 없다.
            </div>

            <button
              v-for="r in results"
              :key="r.placeId"
              type="button"
              class="mb-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left hover:bg-slate-50"
              @click="$emit('selectResult', r.placeId)"
            >
              <p class="text-[14px] font-bold text-slate-900">{{ r.name }}</p>
              <p class="mt-1 line-clamp-2 text-[12px] text-slate-600">{{ r.address }}</p>
              <div class="mt-2 flex items-center justify-between gap-3">
                <span
                  class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
                >
                  {{ r.category ?? 'place' }}
                </span>

                <button
                  type="button"
                  class="rounded-lg bg-slate-900 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-slate-800"
                  @click.stop="$emit('addPlace', r.placeId)"
                >
                  추가
                </button>
              </div>
            </button>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white">
          <div class="border-b border-slate-200 px-4 py-3">
            <p class="text-sm font-semibold text-slate-800">상세 정보</p>
            <p class="mt-1 text-[12px] text-slate-500">결과를 선택하면 표시된다.</p>
          </div>

          <div class="p-4">
            <div v-if="!selectedDetail" class="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              아직 선택된 장소가 없다.
            </div>

            <div v-else class="space-y-3">
              <div>
                <p class="text-[15px] font-bold text-slate-900">{{ selectedDetail.name }}</p>
                <p class="mt-1 text-[12px] text-slate-600">{{ selectedDetail.address }}</p>
              </div>

              <div class="grid gap-2 text-[13px] text-slate-700">
                <div class="flex items-center justify-between">
                  <span class="text-slate-500">전화</span>
                  <span class="font-semibold">{{ selectedDetail.phone ?? '-' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-500">영업</span>
                  <span class="font-semibold">{{ selectedDetail.openingHours ?? '-' }}</span>
                </div>
              </div>

              <p class="text-[13px] leading-relaxed text-slate-600">
                {{ selectedDetail.description ?? '' }}
              </p>

              <button
                type="button"
                class="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                @click="$emit('addPlace', selectedDetail.placeId)"
              >
                이 장소 담기
              </button>
            </div>
          </div>
        </div>

        <p class="px-1 text-[12px] text-slate-400">
          * 지도는 연결했고, 다음은 Places 검색/상세를 실제 API로 붙이면 된다.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import GoogleMap from '@/components/travel/GoogleMap.vue'

const props = defineProps({
  query: { type: String, default: '' },
  results: { type: Array, default: () => [] },
  selectedDetail: { type: Object, default: null },

  places: { type: Array, default: () => [] },
  activeId: { type: String, default: null },
})

defineEmits(['updateQuery', 'search', 'selectResult', 'addPlace', 'selectPlace'])

const mapMarkers = computed(() =>
  (props.places || [])
    .filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number')
    .map((p) => ({
      id: p.projectPlaceId,
      lat: p.lat,
      lng: p.lng,
      title: p.name,
    })),
)

const mapCenter = computed(() => {
  const active = props.places?.find((p) => p.projectPlaceId === props.activeId)
  if (active?.lat && active?.lng) return { lat: active.lat, lng: active.lng }

  const first = props.places?.find((p) => typeof p.lat === 'number' && typeof p.lng === 'number')
  if (first) return { lat: first.lat, lng: first.lng }

  return { lat: 37.5665, lng: 126.978 }
})
</script>
