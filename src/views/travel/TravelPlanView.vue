<template>
  <div class="relative h-screen w-screen overflow-hidden">
    <GoogleMap
      class="absolute inset-0 h-full w-full"
      :center="mapCenter"
      :markers="savedMapMarkers"
      :active-id="activeSavedPlaceId"
      :search-markers="searchMapMarkers"
      :active-search-id="activeSearchId"
      :ai-markers="aiPreviewMarkers"
      @ready="onMapReady"
      @markerClick="handleSelectSavedPlace"
      @searchMarkerClick="handleSelectSearchMarker"
    />

    <aside
      class="absolute left-4 top-24 z-20 w-[360px] max-h-[calc(100vh-7.5rem)] overflow-auto rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur"
    >
      <SavedListPanel
        :places="projectPlaces"
        :active-place-id="activeSavedPlaceId"
        :route-candidates="routeCandidates"
        :ai-loading="aiLoading"
        :ai-error="aiError"
        :applying-route-type="applyingRouteType"
        :apply-error="applyError"
        :apply-help-text="applyHelpText"
        :active-candidate-route-type="activeCandidateRouteType"
        :active-candidate-day="activeCandidateDay"
        @selectPlace="handleSelectSavedPlace"
        @removePlace="handleRemoveSavedPlace"
        @requestAiRoutes="handleRequestAiRoutes"
        @applyAiRoute="handleApplyAiRoute"
        @previewAiCandidate="handlePreviewAiCandidate"
        @previewAiDay="handlePreviewAiDay"
      />
    </aside>

    <RightSearchPanel
      class="absolute right-4 top-24 z-30 w-[420px] max-h-[calc(100vh-7.5rem)]"
      :query="searchQuery"
      :loading="searchLoading"
      :error="searchError"
      :results="searchResults"
      :active-id="activeSearchId"
      :detail="selectedSearchDetail"
      @updateQuery="(v) => (searchQuery = v)"
      @search="handleSearch"
      @clear="clearSearch"
      @select="handleSelectSearchResult"
      @addDetail="handleAddSelectedSearchPlace"
    />

    <div
      v-if="showSavedModal"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4"
      @click.self="closeSavedModal"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <p class="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-400">saved</p>
        <h3 class="mt-1 text-lg font-bold text-slate-900">코스 저장 완료</h3>

        <p class="mt-2 text-sm text-slate-600">
          저장한 코스는 <span class="font-semibold text-slate-900">프로젝트 일정</span>에
          추가됩니다. <br />지금 바로 확인하고 상세 수정도 할 수 있어요.
        </p>

        <div class="mt-5 flex gap-2">
          <button
            type="button"
            class="cursor-pointer h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
            @click="closeSavedModal"
          >
            다시 선택
          </button>

          <button
            type="button"
            class="cursor-pointer h-11 flex-1 rounded-xl bg-gradient-to-r from-start to-end text-sm font-semibold text-white shadow-md transition hover:from-start-hover hover:to-end-hover"
            @click="goItinerary"
          >
            일정 보러가기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import GoogleMap from '@/components/travel/GoogleMap.vue'
import SavedListPanel from '@/components/travel/SavedListPanel.vue'
import RightSearchPanel from '@/components/travel/RightSearchPanel.vue'

import {
  fetchTravelPlaces,
  addTravelPlace,
  deleteTravelPlace,
  autoGenerateItinerary,
  selectAiItinerary,
  searchPlaces,
  fetchPlaceDetails,
} from '@/api/travel'

const route = useRoute()
const router = useRouter()

const projectId = computed(() => Number(route.params.id))
const baseMode = computed(() => (route.path.startsWith('/group') ? 'group' : 'solo'))
const itineraryPath = computed(() => `/${baseMode.value}/${projectId.value}/itinerary`)

const applyHelpText = computed(
  () => '저장하면 프로젝트 일정에 추가됩니다. 저장 후 바로 확인하고 상세 수정도 할 수 있어요.',
)

const projectPlaces = ref([])
const activeSavedPlaceId = ref(null)

const aiResultId = ref(null)
const routeCandidates = ref([])

const aiLoading = ref(false)
const aiError = ref('')
const applyingRouteType = ref(null)
const applyError = ref('')

const activeCandidateRouteType = ref(null)
const activeCandidateDay = ref(1)

const searchQuery = ref('')
const searchResults = ref([])
const activeSearchId = ref(null)
const selectedSearchDetail = ref(null)

const searchLoading = ref(false)
const searchError = ref('')

const mapRef = ref(null)

const showSavedModal = ref(false)
const savedRouteType = ref(null)

const closeSavedModal = () => {
  showSavedModal.value = false
  savedRouteType.value = null
}

const goItinerary = () => {
  closeSavedModal()
  router.push(itineraryPath.value)
}

const onMapReady = (map) => {
  mapRef.value = map
}

const savedMapMarkers = computed(() =>
  (Array.isArray(projectPlaces.value) ? projectPlaces.value : [])
    .filter((p) => typeof p?.lat === 'number' && typeof p?.lng === 'number')
    .map((p) => ({
      id: p.googlePlaceId,
      lat: p.lat,
      lng: p.lng,
      title: p.name,
    })),
)

const searchMapMarkers = computed(() =>
  (Array.isArray(searchResults.value) ? searchResults.value : [])
    .filter((r) => typeof r?.lat === 'number' && typeof r?.lng === 'number')
    .map((r) => ({ id: r.placeId, lat: r.lat, lng: r.lng, title: r.name })),
)

const activeCandidate = computed(
  () =>
    (Array.isArray(routeCandidates.value) ? routeCandidates.value : []).find(
      (c) => c?.routeType === activeCandidateRouteType.value,
    ) ?? null,
)

const activeCandidateDayPlaces = computed(() => {
  const candidate = activeCandidate.value
  if (!candidate) return []
  const days = Array.isArray(candidate.days) ? candidate.days : []
  const dayObj = days.find((d) => d?.day === activeCandidateDay.value) ?? days[0] ?? null
  const places = Array.isArray(dayObj?.places) ? dayObj.places : []
  return places
})

const aiPreviewMarkers = computed(() => {
  const places = activeCandidateDayPlaces.value
  return (Array.isArray(places) ? places : [])
    .map((p, idx) => {
      const lat = p?.latitude ?? p?.lat
      const lng = p?.longitude ?? p?.lng
      if (typeof lat !== 'number' || typeof lng !== 'number') return null
      return {
        id: `${activeCandidateRouteType.value || 'ai'}-${activeCandidateDay.value}-${idx}`,
        order: idx + 1,
        lat,
        lng,
        title: p?.placeName ?? p?.name ?? '',
        isNew: !!p?.newPlace,
        placeId: p?.placeId ?? null,
        googlePlaceId: p?.googlePlaceId ?? null,
      }
    })
    .filter(Boolean)
})

const mapCenter = computed(() => {
  if (aiPreviewMarkers.value.length) {
    return { lat: aiPreviewMarkers.value[0].lat, lng: aiPreviewMarkers.value[0].lng }
  }

  const savedActive = (Array.isArray(projectPlaces.value) ? projectPlaces.value : []).find(
    (p) => p?.googlePlaceId === activeSavedPlaceId.value,
  )
  if (typeof savedActive?.lat === 'number' && typeof savedActive?.lng === 'number') {
    return { lat: savedActive.lat, lng: savedActive.lng }
  }

  const firstSaved = (Array.isArray(projectPlaces.value) ? projectPlaces.value : []).find(
    (p) => typeof p?.lat === 'number' && typeof p?.lng === 'number',
  )
  if (firstSaved) return { lat: firstSaved.lat, lng: firstSaved.lng }

  const searchActive = (Array.isArray(searchResults.value) ? searchResults.value : []).find(
    (r) => r?.placeId === activeSearchId.value,
  )
  if (typeof searchActive?.lat === 'number' && typeof searchActive?.lng === 'number') {
    return { lat: searchActive.lat, lng: searchActive.lng }
  }

  return { lat: 37.5665, lng: 126.978 }
})

const loadPlaces = async () => {
  if (!Number.isFinite(projectId.value)) return
  try {
    const list = await fetchTravelPlaces({ projectId: projectId.value })
    const raw = Array.isArray(list) ? list : []

    projectPlaces.value = raw.map((p) => ({
      placeId: p.placeId,
      googlePlaceId: p.googlePlaceId,
      name: p.placeName,
      address: p.placeAddress,
      category: p.placeType,
      lat: p.latitude,
      lng: p.longitude,
      thumbnail: p.thumbnail,
      createdAt: p.createdAt,
    }))

    if (!activeSavedPlaceId.value && projectPlaces.value.length) {
      activeSavedPlaceId.value = projectPlaces.value[0].googlePlaceId
    }
  } catch (e) {
    console.warn(e)
  }
}

onMounted(loadPlaces)

const handleSelectSavedPlace = (googlePlaceId) => {
  activeSavedPlaceId.value = googlePlaceId
}

const handleRemoveSavedPlace = async (placeId) => {
  if (!Number.isFinite(projectId.value)) return

  const removedGooglePlaceId =
    projectPlaces.value.find((p) => p?.placeId === placeId)?.googlePlaceId ?? null

  try {
    await deleteTravelPlace({ projectId: projectId.value, placeId })
    await loadPlaces()

    if (removedGooglePlaceId && activeSavedPlaceId.value === removedGooglePlaceId) {
      activeSavedPlaceId.value =
        projectPlaces.value.length > 0 ? projectPlaces.value[0].googlePlaceId : null
    }
  } catch (e) {
    console.warn(e)
    alert('삭제에 실패했습니다.')
  }
}

const handlePreviewAiCandidate = (routeType) => {
  activeCandidateRouteType.value = routeType
  activeCandidateDay.value = 1
}

const handlePreviewAiDay = ({ routeType, day }) => {
  activeCandidateRouteType.value = routeType
  activeCandidateDay.value = day
}

const handleRequestAiRoutes = async () => {
  if (!Number.isFinite(projectId.value)) return
  if (aiLoading.value) return

  aiLoading.value = true
  aiError.value = ''
  applyError.value = ''

  activeCandidateRouteType.value = null
  activeCandidateDay.value = 1

  try {
    routeCandidates.value = []
    aiResultId.value = null

    const res = await autoGenerateItinerary({ projectId: projectId.value })

    aiResultId.value = res?.aiResultId ?? null
    routeCandidates.value = Array.isArray(res?.candidates) ? res.candidates : []

    if (!aiResultId.value || routeCandidates.value.length === 0) {
      aiError.value = '추천 결과가 없습니다. 담은 장소를 늘리거나 다시 시도해보세요.'
      return
    }

    const first = routeCandidates.value[0]
    if (first?.routeType != null) {
      activeCandidateRouteType.value = first.routeType
      activeCandidateDay.value = 1
    }
  } catch (e) {
    console.error(e)
    if (e?.code === 'ECONNABORTED') {
      aiError.value = '추천 생성이 오래 걸리고 있어요. 잠시 후 다시 시도해 주세요.'
    } else {
      aiError.value =
        e?.response?.data?.message || e?.response?.data?.error || 'AI 추천 중 오류가 발생했습니다.'
    }
  } finally {
    aiLoading.value = false
  }
}

const handleApplyAiRoute = async (routeType) => {
  if (!Number.isFinite(projectId.value)) return
  if (!aiResultId.value) {
    applyError.value = '먼저 추천받기를 눌러주세요.'
    return
  }
  if (applyingRouteType.value != null) return

  applyingRouteType.value = routeType
  applyError.value = ''
  try {
    await selectAiItinerary({
      projectId: projectId.value,
      aiResultId: aiResultId.value,
      routeType,
    })

    savedRouteType.value = routeType
    showSavedModal.value = true
  } catch (e) {
    console.error(e)
    applyError.value =
      e?.response?.data?.message || e?.response?.data?.error || '경로 저장 중 오류가 발생했습니다.'
  } finally {
    applyingRouteType.value = null
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  searchError.value = ''
  activeSearchId.value = null
  selectedSearchDetail.value = null
}

const handleSearch = async () => {
  const q = searchQuery.value.trim()
  if (!q) return
  if (!Number.isFinite(projectId.value)) return

  searchLoading.value = true
  searchError.value = ''
  searchResults.value = []
  activeSearchId.value = null
  selectedSearchDetail.value = null

  try {
    const center = mapRef.value?.getCenter?.()
    const location =
      center && typeof center.lat === 'function' && typeof center.lng === 'function'
        ? `${center.lat()},${center.lng()}`
        : undefined

    const res = await searchPlaces({
      projectId: projectId.value,
      query: q,
      location,
    })

    const places = Array.isArray(res?.places) ? res.places : []
    searchResults.value = places.map((p) => ({
      placeId: p.placeId,
      name: p.name ?? '',
      address: p.formattedAddress ?? '',
      category: p.tag ?? 'place',
      lat: p.lat,
      lng: p.lng,
    }))
  } catch (e) {
    console.error(e)
    searchError.value =
      e?.response?.data?.message || e?.response?.data?.error || '검색 중 오류가 발생했습니다.'
  } finally {
    searchLoading.value = false
  }
}

const handleSelectSearchResult = (placeId) => {
  handleSelectSearchMarker(placeId)
}

const handleSelectSearchMarker = async (placeId) => {
  activeSearchId.value = placeId
  if (!Number.isFinite(projectId.value)) return

  searchLoading.value = true
  searchError.value = ''

  try {
    const detail = await fetchPlaceDetails({
      projectId: projectId.value,
      placeId,
    })

    selectedSearchDetail.value = {
      placeId: detail?.placeId ?? placeId,
      name: detail?.name ?? '',
      address: detail?.formattedAddress ?? '',
      phone: detail?.formattedPhoneNumber ?? '',
      category: Array.isArray(detail?.types) && detail.types.length ? detail.types[0] : 'place',
      lat: detail?.geometry?.lat ?? null,
      lng: detail?.geometry?.lng ?? null,
      openingHours:
        Array.isArray(detail?.openingHours) && detail.openingHours[0]?.weekdayText
          ? detail.openingHours[0].weekdayText.join(' / ')
          : '',
      website: detail?.website ?? '',
      rating: detail?.rating ?? null,
      photos: Array.isArray(detail?.photoUrls) ? detail.photoUrls.slice(0, 8) : [],
      reviews: Array.isArray(detail?.reviews)
        ? detail.reviews.slice(0, 5).map((r) => ({
            author: r.authorName ?? '',
            rating: r.rating ?? null,
            text: r.text ?? '',
            time: r.relativeTimeDescription ?? '',
          }))
        : [],
    }
  } catch (e) {
    console.error(e)
    selectedSearchDetail.value = null
    searchError.value =
      e?.response?.data?.message || e?.response?.data?.error || '상세 조회 중 오류가 발생했습니다.'
  } finally {
    searchLoading.value = false
  }
}

const handleAddSelectedSearchPlace = async () => {
  if (!selectedSearchDetail.value) return
  if (!Number.isFinite(projectId.value)) return

  const placeId = selectedSearchDetail.value.placeId

  try {
    await addTravelPlace({ projectId: projectId.value, placeId })

    await loadPlaces()
    activeSavedPlaceId.value = placeId

    selectedSearchDetail.value = null
    activeSearchId.value = null
  } catch (e) {
    console.error(e)
    const message =
      e?.response?.data?.message || e?.response?.data?.error || '장소 추가 중 오류가 발생했습니다.'
    alert(message)
  }
}
</script>
