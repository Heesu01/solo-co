<template>
  <div class="relative h-screen w-screen overflow-hidden">
    <GoogleMap
      class="absolute inset-0 h-full w-full"
      :center="mapCenter"
      :markers="savedMapMarkers"
      :active-id="activeSavedPlaceId"
      :search-markers="searchMapMarkers"
      :active-search-id="activeSearchId"
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
        :selected-route-id="selectedRouteId"
        @selectPlace="handleSelectSavedPlace"
        @removePlace="handleRemoveSavedPlace"
        @requestAiRoutes="handleRequestAiRoutes"
        @selectRoute="handleSelectRoute"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import GoogleMap from '@/components/travel/GoogleMap.vue'
import SavedListPanel from '@/components/travel/SavedListPanel.vue'
import RightSearchPanel from '@/components/travel/RightSearchPanel.vue'

import { fetchTravelPlaces, addTravelPlace, deleteTravelPlace } from '@/api/travel'

const route = useRoute()
const projectId = computed(() => Number(route.params.id))

const projectPlaces = ref([])
const activeSavedPlaceId = ref(null)
const routeCandidates = ref([])
const selectedRouteId = ref(null)

const searchQuery = ref('')
const searchResults = ref([])
const activeSearchId = ref(null)
const selectedSearchDetail = ref(null)

const searchLoading = ref(false)
const searchError = ref('')

const mapRef = ref(null)
let placesService = null

const onMapReady = (map) => {
  mapRef.value = map

  placesService = new google.maps.places.PlacesService(map)
}

const savedMapMarkers = computed(() =>
  projectPlaces.value
    .filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number')
    .map((p) => ({
      id: p.googlePlaceId,
      lat: p.lat,
      lng: p.lng,
      title: p.name,
    })),
)

const searchMapMarkers = computed(() =>
  searchResults.value
    .filter((r) => typeof r.lat === 'number' && typeof r.lng === 'number')
    .map((r) => ({ id: r.placeId, lat: r.lat, lng: r.lng, title: r.name })),
)

const mapCenter = computed(() => {
  const savedActive = projectPlaces.value.find((p) => p.googlePlaceId === activeSavedPlaceId.value)
  if (typeof savedActive?.lat === 'number' && typeof savedActive?.lng === 'number') {
    return { lat: savedActive.lat, lng: savedActive.lng }
  }

  const firstSaved = projectPlaces.value.find(
    (p) => typeof p.lat === 'number' && typeof p.lng === 'number',
  )
  if (firstSaved) return { lat: firstSaved.lat, lng: firstSaved.lng }

  const searchActive = searchResults.value.find((r) => r.placeId === activeSearchId.value)
  if (searchActive?.lat && searchActive?.lng) {
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
    projectPlaces.value.find((p) => p.placeId === placeId)?.googlePlaceId ?? null

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

const handleRequestAiRoutes = () => {
  routeCandidates.value = [
    {
      id: 'r1',
      title: '도심 감성 코스',
      summary: '카페 → 산책 → 맛집',
      stops: [],
      duration: '약 5시간',
    },
  ]
  selectedRouteId.value = null
}

const handleSelectRoute = (routeId) => {
  selectedRouteId.value = routeId
}

const handleSearch = () => {
  const q = searchQuery.value.trim()
  if (!q) return

  if (!placesService || !mapRef.value) {
    searchError.value = '지도가 아직 준비되지 않았습니다.'
    return
  }

  searchLoading.value = true
  searchError.value = ''

  placesService.textSearch(
    {
      query: q,
      bounds: mapRef.value.getBounds() || undefined,
    },
    (results, status) => {
      searchLoading.value = false

      if (status !== google.maps.places.PlacesServiceStatus.OK || !Array.isArray(results)) {
        searchResults.value = []
        activeSearchId.value = null
        selectedSearchDetail.value = null
        searchError.value = '검색 결과가 없습니다.'
        return
      }

      searchResults.value = results
        .filter((r) => r.place_id && r.geometry?.location)
        .map((r) => ({
          placeId: r.place_id,
          name: r.name ?? '',
          address: r.formatted_address ?? r.vicinity ?? '',
          category: Array.isArray(r.types) && r.types.length ? r.types[0] : 'place',
          lat: r.geometry.location.lat(),
          lng: r.geometry.location.lng(),
        }))

      activeSearchId.value = null
      selectedSearchDetail.value = null
    },
  )
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  searchError.value = ''
  activeSearchId.value = null
  selectedSearchDetail.value = null
}

const handleSelectSearchResult = (placeId) => {
  handleSelectSearchMarker(placeId)
}

const handleSelectSearchMarker = (placeId) => {
  activeSearchId.value = placeId
  if (!placesService) return

  searchLoading.value = true
  searchError.value = ''

  placesService.getDetails(
    {
      placeId,
      fields: [
        'place_id',
        'name',
        'formatted_address',
        'formatted_phone_number',
        'geometry',
        'opening_hours',
        'website',
        'rating',
        'types',
        'photos',
        'reviews',
      ],
    },
    (place, status) => {
      searchLoading.value = false

      if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
        selectedSearchDetail.value = null
        searchError.value = '상세 정보를 불러오는 중 오류가 발생했습니다.'
        return
      }

      const photoUrls =
        place.photos?.slice(0, 6).map((p) => p.getUrl({ maxWidth: 640, maxHeight: 640 })) ?? []

      const reviews =
        place.reviews?.slice(0, 5).map((r) => ({
          author: r.author_name ?? '',
          rating: r.rating ?? null,
          text: r.text ?? '',
          time: r.relative_time_description ?? '',
        })) ?? []

      selectedSearchDetail.value = {
        placeId: place.place_id,
        name: place.name ?? '',
        address: place.formatted_address ?? '',
        phone: place.formatted_phone_number ?? '',
        category: Array.isArray(place.types) && place.types.length ? place.types[0] : 'place',
        lat: place.geometry?.location?.lat?.(),
        lng: place.geometry?.location?.lng?.(),
        openingHours: place.opening_hours?.weekday_text?.join(' / ') ?? '',
        website: place.website ?? '',
        rating: place.rating ?? null,
        photos: photoUrls,
        reviews,
      }
    },
  )
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
