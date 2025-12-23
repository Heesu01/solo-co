<template>
  <div class="relative h-screen w-screen overflow-hidden">
    <ItineraryMap
      class="absolute inset-0 h-full w-full"
      :center="mapCenter"
      :markers="mapMarkers"
      :search-markers="searchMarkers"
      :active-id="activePlaceId"
      :active-search-id="activeSearchId"
      @ready="onMapReady"
      @markerClick="handleMarkerClick"
      @searchMarkerClick="handleSearchMarkerClick"
    />

    <button
      type="button"
      class="cursor-pointer fixed bottom-6 right-6 z-30 inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-start to-end px-5 text-[14px] font-bold text-white shadow-2xl transition hover:from-start-hover hover:to-end-hover active:scale-[0.98]"
      @click="openAddPanel"
    >
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14" stroke-linecap="round" />
      </svg>
      장소 추가
    </button>

    <!-- <div v-if="showAddPanel" class="fixed inset-0 z-20 bg-transparent" @click="closeAddPanel"></div> -->

    <aside
      class="absolute left-4 top-24 z-20 w-[380px] max-h-[calc(100vh-7.5rem)] overflow-auto rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur"
    >
      <div class="border-b border-slate-200 px-5 py-4">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          itinerary
        </p>

        <div class="mt-1 flex items-center justify-between gap-3">
          <h1 class="text-[16px] font-bold text-slate-900">프로젝트 경로</h1>

          <div v-if="!isEmptyItinerary" class="flex items-center gap-2">
            <button
              type="button"
              class="cursor-pointer h-9 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-primary transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="loading || saving || savingDay"
              @click="handleDeleteItinerary"
            >
              새 일정 만들기
            </button>
          </div>
        </div>

        <p class="mt-1 text-[12px] text-slate-600">
          날짜별 경로를 확인하고 장소를 수정할 수 있어요.
        </p>

        <p
          v-if="loadError"
          class="mt-3 rounded-xl bg-rose-50 p-3 text-[12px] font-semibold text-rose-700"
        >
          {{ loadError }}
        </p>
      </div>

      <div class="space-y-4 px-5 py-4">
        <div v-if="isEmptyItinerary && !loading" class="rounded-2xl p-5">
          <p class="text-[13px] font-semibold text-slate-900">아직 계획한 일정이 없어요.</p>
          <p class="mt-1 text-[12px] text-slate-600">
            계획 페이지에서 장소를 담고 일정을 생성해 주세요.
          </p>

          <button
            type="button"
            class="cursor-pointer mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-700 border border-slate-300 transition hover:from-start-hover hover:to-end-hover"
            @click="goToTravel"
          >
            일정 짜러가기
          </button>
        </div>

        <template v-else>
          <ItineraryDayTabs
            :days="days"
            :active-day="activeDay"
            :counts="dayCounts"
            @selectDay="setActiveDay"
          />

          <ItineraryDayEditor
            :day="activeDay"
            :places="activeDayPlaces"
            :active-place-id="activePlaceId"
            :saving="savingDay"
            :error="dayError"
            @selectPlace="setActivePlace"
            @movePlace="handleMovePlace"
            @removePlace="handleRemovePlace"
            @saveDay="handleSaveDay"
          />
        </template>
      </div>

      <div
        class="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur"
      >
        <button
          type="button"
          class="cursor-pointer inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-start to-end text-[14px] font-bold text-white shadow-lg transition hover:from-start-hover hover:to-end-hover disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="saving || loading || savingDay"
          @click="handleSaveAll"
        >
          <span v-if="saving">저장중…</span>
          <span v-else>전체 저장</span>
        </button>
      </div>
    </aside>

    <transition name="slide-right">
      <aside
        v-if="showAddPanel"
        class="fixed right-4 top-24 z-30 w-[360px] max-h-[calc(100vh-7.5rem)] overflow-hidden"
      >
        <div
          class="mb-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur"
        >
          <div class="min-w-0">
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              add place
            </p>
            <p class="mt-0.5 text-[13px] font-semibold text-slate-700 truncate">
              day {{ activeDay }}에 추가
            </p>
          </div>

          <button
            type="button"
            class="cursor-pointer inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="closeAddPanel"
          >
            닫기
          </button>
        </div>

        <RightSearchPanel
          :query="searchQuery"
          :loading="searchLoading"
          :error="searchError"
          :results="searchResults"
          :active-id="activeSearchId"
          :detail="searchDetail"
          @updateQuery="(v) => (searchQuery = v)"
          @search="handleSearch"
          @select="handleSelectSearchResult"
          @addDetail="handleAddDetail"
        />
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ItineraryDayTabs from '@/components/travel/ItineraryDayTabs.vue'
import ItineraryMap from '@/components/travel/ItineraryMap.vue'
import ItineraryDayEditor from '@/components/travel/ItineraryDayEditor.vue'
import RightSearchPanel from '@/components/travel/RightSearchPanel.vue'

import {
  fetchItinerary,
  updateItinerary,
  deleteItinerary,
  searchPlaces,
  fetchPlaceDetails,
} from '@/api/travel'

const route = useRoute()
const router = useRouter()

const projectId = computed(() => Number(route.params.id))
const baseMode = computed(() => (route.path.startsWith('/group') ? 'group' : 'solo'))
const travelPath = computed(() => `/${baseMode.value}/${projectId.value}/travel`)

const showAddPanel = ref(false)
const openAddPanel = () => {
  showAddPanel.value = true
}
const closeAddPanel = () => {
  showAddPanel.value = false
}

const loading = ref(false)
const loadError = ref('')
const days = ref([])
const itineraryByDay = ref({})

const activeDay = ref(1)
const activePlaceId = ref(null)

const saving = ref(false)
const savingDay = ref(false)
const dayError = ref('')

const mapRef = ref(null)
const mapReady = ref(false)

const searchQuery = ref('')
const searchLoading = ref(false)
const searchError = ref('')
const searchResults = ref([])
const searchMarkers = ref([])
const activeSearchId = ref(null)
const searchDetail = ref(null)

const nextPageToken = ref(null)

const placeKey = (p) => p?.googlePlaceId ?? p?.placeId ?? null

const isEmptyItinerary = computed(() => {
  const dayList = Array.isArray(days.value) ? days.value : []
  if (!dayList.length) return true

  return dayList.every((d) => {
    const list = itineraryByDay.value?.[d]
    return !Array.isArray(list) || list.length === 0
  })
})

const goToTravel = () => {
  if (!Number.isFinite(projectId.value)) return
  router.push(travelPath.value)
}

const activeDayPlaces = computed(() => {
  const list = itineraryByDay.value?.[activeDay.value]
  return Array.isArray(list) ? list : []
})

const dayCounts = computed(() => {
  const out = {}
  const dayList = Array.isArray(days.value) ? days.value : []
  for (const d of dayList) {
    const list = itineraryByDay.value?.[d]
    out[d] = Array.isArray(list) ? list.length : 0
  }
  return out
})

const mapMarkers = computed(() => {
  return activeDayPlaces.value
    .filter((p) => typeof p?.lat === 'number' && typeof p?.lng === 'number')
    .map((p, idx) => ({
      id: placeKey(p) ?? String(idx),
      lat: p.lat,
      lng: p.lng,
      title: p.name ?? '',
      order: idx + 1,
    }))
})

const mapCenter = computed(() => {
  const active = activeDayPlaces.value.find((p) => placeKey(p) === activePlaceId.value)
  if (typeof active?.lat === 'number' && typeof active?.lng === 'number')
    return { lat: active.lat, lng: active.lng }

  const first = activeDayPlaces.value.find(
    (p) => typeof p?.lat === 'number' && typeof p?.lng === 'number',
  )
  if (first) return { lat: first.lat, lng: first.lng }

  const sActive = searchResults.value.find((r) => r.placeId === activeSearchId.value)
  if (typeof sActive?.lat === 'number' && typeof sActive?.lng === 'number') {
    return { lat: sActive.lat, lng: sActive.lng }
  }

  const sFirst = searchResults.value.find(
    (r) => typeof r?.lat === 'number' && typeof r?.lng === 'number',
  )
  if (sFirst) return { lat: sFirst.lat, lng: sFirst.lng }

  return { lat: 37.5665, lng: 126.978 }
})

const normalizeItinerary = (raw) => {
  const safe = raw ?? {}
  const daysArr = Array.isArray(safe?.days) ? safe.days : []

  const sortedDays = [...daysArr]
    .filter((d) => Number.isFinite(Number(d?.day)))
    .sort((a, b) => Number(a.day) - Number(b.day))

  const dayNums = sortedDays.map((d) => Number(d.day))

  const byDay = {}
  for (const d of sortedDays) {
    const day = Number(d.day)
    const places = Array.isArray(d?.places) ? d.places : []
    byDay[day] = [...places]
      .sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0))
      .map((p) => ({
        placeId: p?.placeId ?? null,
        googlePlaceId: p?.googlePlaceId ?? null,
        name: p?.placeName ?? '',
        address: p?.address ?? p?.placeAddress ?? '',
        category: p?.placeType ?? 'place',
        lat: p?.latitude,
        lng: p?.longitude,
        thumbnail: p?.thumbnail ?? null,
        order: p?.order ?? null,
      }))
  }

  return { days: dayNums, byDay }
}

const buildUpdatePayloadPlacesAll = () => {
  const out = []
  const dayList = Array.isArray(days.value) ? days.value : []

  for (const day of dayList) {
    const list = Array.isArray(itineraryByDay.value?.[day]) ? itineraryByDay.value[day] : []
    list.forEach((p, idx) => {
      const base = { day, order: idx + 1 }
      if (p?.placeId != null) out.push({ ...base, placeId: p.placeId })
      else if (p?.googlePlaceId) out.push({ ...base, googlePlaceId: p.googlePlaceId })
    })
  }
  return out
}

const onMapReady = (map) => {
  mapReady.value = true
  mapRef.value = map
}

const setActiveDay = (day) => {
  activeDay.value = day
  const list = Array.isArray(itineraryByDay.value?.[day]) ? itineraryByDay.value[day] : []
  const first = list[0]
  activePlaceId.value = first ? placeKey(first) : null
  dayError.value = ''
}

const setActivePlace = (id) => {
  activePlaceId.value = id
}
const handleMarkerClick = (id) => {
  activePlaceId.value = id
}

const handleSearchMarkerClick = (placeId) => {
  activeSearchId.value = placeId
  loadPlaceDetail(placeId)
}

const handleMovePlace = ({ fromIndex, toIndex }) => {
  const list = [...activeDayPlaces.value]
  if (fromIndex < 0 || toIndex < 0) return
  if (fromIndex >= list.length || toIndex >= list.length) return
  const [moved] = list.splice(fromIndex, 1)
  list.splice(toIndex, 0, moved)
  itineraryByDay.value = { ...itineraryByDay.value, [activeDay.value]: list }
}

const handleRemovePlace = (key) => {
  const list = activeDayPlaces.value.filter((p) => placeKey(p) !== key)
  itineraryByDay.value = { ...itineraryByDay.value, [activeDay.value]: list }
  if (activePlaceId.value === key) {
    const first = list[0]
    activePlaceId.value = first ? placeKey(first) : null
  }
}

const handleSearch = async () => {
  const q = String(searchQuery.value || '').trim()
  if (!q) {
    searchError.value = '검색어를 입력해 주세요.'
    return
  }
  if (!Number.isFinite(projectId.value)) return

  searchLoading.value = true
  searchError.value = ''
  searchResults.value = []
  searchMarkers.value = []
  activeSearchId.value = null
  searchDetail.value = null
  nextPageToken.value = null

  try {
    const center = mapRef.value?.getCenter?.()
    const location =
      center && typeof center.lat === 'function' && typeof center.lng === 'function'
        ? `${center.lat()},${center.lng()}`
        : undefined

    const data = await searchPlaces({
      projectId: projectId.value,
      query: q,
      location,
    })

    const places = Array.isArray(data?.places) ? data.places : []
    nextPageToken.value = data?.nextPageToken ?? null

    const mapped = places.map((p) => ({
      placeId: p.placeId,
      name: p.name ?? '',
      address: p.formattedAddress ?? '',
      category: p.tag ?? 'place',
      lat: p.lat,
      lng: p.lng,
    }))

    searchResults.value = mapped

    searchMarkers.value = mapped
      .filter((x) => typeof x.lat === 'number' && typeof x.lng === 'number')
      .map((x) => ({ id: x.placeId, lat: x.lat, lng: x.lng, title: x.name }))

    if (!mapped.length) {
      searchError.value = '검색 결과가 없습니다.'
      return
    }

    activeSearchId.value = mapped[0].placeId
    await loadPlaceDetail(mapped[0].placeId)
  } catch (e) {
    console.error(e)
    searchError.value =
      e?.response?.data?.message || e?.response?.data?.error || '검색 중 오류가 발생했습니다.'
  } finally {
    searchLoading.value = false
  }
}

const loadPlaceDetail = async (placeId) => {
  if (!placeId) return
  if (!Number.isFinite(projectId.value)) return

  const token = placeId
  searchError.value = ''

  try {
    searchLoading.value = true

    const res = await fetchPlaceDetails({
      projectId: projectId.value,
      placeId,
    })

    if (activeSearchId.value !== token) return

    searchDetail.value = {
      placeId: res?.placeId ?? placeId,
      name: res?.name ?? '',
      address: res?.formattedAddress ?? '',
      category: Array.isArray(res?.types) && res.types.length ? res.types[0] : 'place',
      lat: res?.geometry?.lat,
      lng: res?.geometry?.lng,
      phone: res?.formattedPhoneNumber ?? '',
      rating: res?.rating ?? null,
      website: res?.website ?? '',
      openingHours:
        Array.isArray(res?.openingHours) && res.openingHours.length
          ? (res.openingHours[0]?.weekdayText ?? []).join(' / ')
          : '',
      photos: Array.isArray(res?.photoUrls) ? res.photoUrls.slice(0, 8) : [],
    }
  } catch (e) {
    console.error(e)
    if (activeSearchId.value !== token) return
    searchDetail.value = null
    searchError.value =
      e?.response?.data?.message || e?.response?.data?.error || '상세 정보를 불러오지 못했어요.'
  } finally {
    if (activeSearchId.value === token) searchLoading.value = false
  }
}

const handleSelectSearchResult = async (placeId) => {
  activeSearchId.value = placeId
  await loadPlaceDetail(placeId)
}

const handleAddDetail = () => {
  if (!searchDetail.value) return

  const p = searchDetail.value
  const list = [...activeDayPlaces.value]

  const exists = list.some((x) => x?.googlePlaceId === p.placeId)
  if (exists) {
    alert('이미 이 날짜에 추가된 장소예요.')
    return
  }

  list.push({
    placeId: null,
    googlePlaceId: p.placeId,
    name: p.name,
    address: p.address,
    category: p.category,
    lat: p.lat,
    lng: p.lng,
    thumbnail: p.photos?.[0] ?? null,
    order: list.length + 1,
  })

  itineraryByDay.value = { ...itineraryByDay.value, [activeDay.value]: list }
  activePlaceId.value = p.placeId

  closeAddPanel()
}

const handleDeleteItinerary = async () => {
  if (!Number.isFinite(projectId.value)) return
  const ok = confirm('현재 경로를 삭제하고 다시 계획 페이지로 돌아갈까요?')
  if (!ok) return

  try {
    await deleteItinerary({ projectId: projectId.value })
    router.push(travelPath.value)
  } catch (e) {
    console.error(e)
    alert(e?.response?.data?.message || '경로 삭제 중 오류가 발생했습니다.')
  }
}

const handleSaveDay = async () => {
  if (!Number.isFinite(projectId.value)) return
  savingDay.value = true
  dayError.value = ''
  try {
    const places = buildUpdatePayloadPlacesAll()
    await updateItinerary({ projectId: projectId.value, places })
    await loadItinerary()
  } catch (e) {
    console.error(e)
    dayError.value = e?.response?.data?.message || '저장 중 오류가 발생했습니다.'
  } finally {
    savingDay.value = false
  }
}

const handleSaveAll = async () => {
  if (!Number.isFinite(projectId.value)) return
  saving.value = true
  try {
    const places = buildUpdatePayloadPlacesAll()
    await updateItinerary({ projectId: projectId.value, places })
    await loadItinerary()
    alert('경로 수정 완료')
  } catch (e) {
    console.error(e)
    alert(e?.response?.data?.message || '전체 저장 중 오류가 발생했습니다.')
  } finally {
    saving.value = false
  }
}

const loadItinerary = async () => {
  if (!Number.isFinite(projectId.value)) return
  loading.value = true
  loadError.value = ''
  try {
    const raw = await fetchItinerary({ projectId: projectId.value })
    const normalized = normalizeItinerary(raw)

    days.value = normalized.days.length ? normalized.days : [1]
    itineraryByDay.value = normalized.byDay ?? {}

    if (!days.value.includes(activeDay.value)) activeDay.value = days.value[0]
    const first = (itineraryByDay.value?.[activeDay.value] ?? [])[0]
    activePlaceId.value = first ? placeKey(first) : null
  } catch (e) {
    console.error(e)
    loadError.value = e?.response?.data?.message || '경로를 불러오지 못했습니다.'
    days.value = [1]
    itineraryByDay.value = { 1: [] }
    activeDay.value = 1
    activePlaceId.value = null
  } finally {
    loading.value = false
  }
}

onMounted(loadItinerary)
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition:
    transform 180ms ease,
    opacity 180ms ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(16px);
  opacity: 0;
}
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
