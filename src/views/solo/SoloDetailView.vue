<template>
  <div class="min-h-screen bg-slate-50">
    <div class="w-full px-3 pt-20 pb-10 md:px-6 pt-30">
      <div class="mx-auto max-w-[1400px]">
        <div class="grid gap-6 items-start" style="grid-template-columns: 360px 1fr">
          <SoloDetailSidebar
            :project-id="projectId"
            :project="project"
            :places="places"
            :places-loading="placesLoading"
            :places-error="placesError"
            :status-label="statusLabel"
            :status-chip-class="statusChipClass"
            @itineraryEdit="goToItineraryEdit"
            @travelManage="goToTravelManage"
          />

          <main class="min-w-0">
            <SoloItineraryScoreCard
              v-if="hasItinerary"
              :meta="meta"
              :justification="justification"
            />
            <section class="border border-slate-200 bg-white">
              <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <div>
                  <span class="tracking-[0.18em] font-semibold">MAP</span>
                  <p class="mt-0.5 text-[12px] text-slate-500">
                    Day별 경로를 지도에서 확인할 수 있습니다.
                  </p>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    class="cursor-pointer border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    @click="goToItineraryEdit"
                  >
                    일정 수정
                  </button>

                  <select
                    v-model="activeDay"
                    class="cursor-pointer border border-slate-200 bg-white px-3 py-2 text-xs outline-none"
                    :disabled="!hasItinerary"
                  >
                    <option v-for="d in itineraryDays" :key="d.day" :value="d.day">
                      DAY {{ d.day }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="relative h-[520px]">
                <ItineraryMap
                  v-if="hasItinerary"
                  class="h-full w-full"
                  :center="mapCenter"
                  :zoom="13"
                  :markers="mapMarkers"
                  :search-markers="[]"
                  :active-id="activeMarkerId"
                  :active-search-id="null"
                  :connect-saved-route="true"
                  @markerClick="onMarkerClick"
                  @ready="onMapReady"
                />

                <div v-else class="flex h-full w-full items-center justify-center bg-slate-50">
                  <p class="text-[12px] text-slate-500">일정이 없습니다.</p>
                </div>

                <div v-if="hasItinerary" class="pointer-events-none absolute inset-0 p-4">
                  <div class="flex items-start justify-between gap-3">
                    <div
                      class="pointer-events-auto w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur"
                    >
                      <div class="border-b border-slate-200 px-4 py-3">
                        <p
                          class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400"
                        >
                          day route
                        </p>
                        <div class="mt-0.5 flex items-center justify-between gap-2">
                          <p class="text-[13px] font-semibold text-slate-900">
                            DAY {{ activeDay }}
                          </p>
                          <button
                            type="button"
                            class="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                            @click="activeMarkerId = null"
                          >
                            선택 해제
                          </button>
                        </div>
                        <p class="mt-1 text-[11px] text-slate-500">
                          순서대로 클릭하면 해당 마커가 강조됩니다.
                        </p>
                      </div>

                      <div class="max-h-[360px] overflow-auto px-2 py-2">
                        <button
                          v-for="p in activeDayPlaces"
                          :key="p.placeId ?? `${p.order}-${p.latitude}-${p.longitude}`"
                          type="button"
                          class="cursor-pointer w-full rounded-xl px-3 py-2 text-left transition hover:bg-slate-50"
                          :class="isActivePlace(p) ? 'bg-slate-50 ring-1 ring-slate-200' : ''"
                          @click="focusPlace(p)"
                        >
                          <div class="flex items-start gap-3">
                            <div
                              class="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white"
                            >
                              {{ p.order ?? '-' }}
                            </div>

                            <div class="min-w-0 flex-1">
                              <p class="truncate text-[13px] font-semibold text-slate-900">
                                {{ p.placeName ?? p.name ?? '장소' }}
                              </p>
                              <p class="mt-0.5 line-clamp-2 text-[11px] text-slate-500">
                                {{ p.address ?? p.placeAddress ?? '-' }}
                              </p>

                              <div
                                class="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-400"
                              >
                                <span
                                  class="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-600"
                                >
                                  {{ p.placeType ?? 'place' }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>

                        <div
                          v-if="activeDayPlaces.length === 0"
                          class="p-6 text-center text-[12px] text-slate-500"
                        >
                          DAY {{ activeDay }}에 장소가 없습니다.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchTravelDetail } from '@/api/project'
import { fetchTravelPlaces, fetchItinerary } from '@/api/travel'
import ItineraryMap from '@/components/travel/GoogleMapItinerary.vue'
import SoloDetailSidebar from '@/components/solo/SoloSidebar.vue'
import SoloItineraryScoreCard from '@/components/solo/ScoreCard.vue'

const route = useRoute()
const router = useRouter()
const projectId = computed(() => Number(route.params.id))

const project = ref(null)
const members = ref([])

const loadProject = async () => {
  try {
    const res = await fetchTravelDetail(projectId.value)
    const root = res?.data?.data ?? res?.data ?? null
    project.value = root?.project ?? null
    members.value = Array.isArray(root?.members) ? root.members : []
  } catch (e) {
    project.value = null
    members.value = []
  }
}

const places = ref([])
const placesLoading = ref(false)
const placesError = ref(false)

const loadPlaces = async () => {
  placesLoading.value = true
  placesError.value = false
  try {
    places.value = await fetchTravelPlaces({ projectId: projectId.value })
  } catch (e) {
    placesError.value = true
    places.value = []
  } finally {
    placesLoading.value = false
  }
}

const goToItineraryEdit = () => router.push(`/solo/${projectId.value}/itinerary`)
const goToTravelManage = () => router.push(`/solo/${projectId.value}/travel`)

const statusLabel = computed(() => {
  const s = project.value?.status
  if (s === 'DONE') return '완료'
  if (s === 'IN_PROGRESS') return '진행 중'
  return '예정'
})

const statusChipClass = computed(() => {
  const s = project.value?.status
  if (s === 'DONE') return 'bg-slate-100 text-slate-600'
  if (s === 'IN_PROGRESS') return 'bg-emerald-50 text-emerald-700'
  return 'bg-sky-50 text-sky-700'
})

const itinerary = ref(null)
const itineraryLoading = ref(false)
const itineraryError = ref(false)

const reloadItinerary = async () => {
  itineraryLoading.value = true
  itineraryError.value = false
  try {
    const data = await fetchItinerary({ projectId: projectId.value })
    itinerary.value = data ?? null
  } catch (e) {
    itineraryError.value = true
    itinerary.value = null
  } finally {
    itineraryLoading.value = false
  }
}

const hasItinerary = computed(
  () => Array.isArray(itinerary.value?.days) && itinerary.value.days.length > 0,
)

const itineraryDays = computed(() => itinerary.value?.days ?? [])
const meta = computed(() => itinerary.value?.meta ?? {})
const justification = computed(() => meta.value?.scoreJustification ?? {})

const activeDay = ref(1)
watch(itineraryDays, (days) => {
  if (!Array.isArray(days) || days.length === 0) return
  if (!days.find((d) => d.day === activeDay.value)) activeDay.value = days[0].day
})

const activeDayPlaces = computed(() => {
  const day = itineraryDays.value.find((d) => d.day === activeDay.value)
  const list = Array.isArray(day?.places) ? day.places : []
  return [...list].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
})

const mapMarkers = computed(() => {
  const list = Array.isArray(activeDayPlaces.value) ? activeDayPlaces.value : []
  return list
    .map((p, idx) => {
      const lat = Number(p?.latitude)
      const lng = Number(p?.longitude)
      if (Number.isNaN(lat) || Number.isNaN(lng)) return null
      const order = Number(p?.order ?? idx + 1)
      const id = p?.placeId ?? p?.id ?? `${order}-${lat}-${lng}`
      return { id, lat, lng, order, title: p?.placeName ?? p?.name ?? '장소' }
    })
    .filter(Boolean)
})

const mapCenter = computed(() => {
  if (mapMarkers.value.length === 0) return { lat: 37.5665, lng: 126.978 }
  return { lat: mapMarkers.value[0].lat, lng: mapMarkers.value[0].lng }
})

const activeMarkerId = ref(null)
const onMarkerClick = (id) => {
  activeMarkerId.value = id
}
const onMapReady = () => {}

const focusPlace = (p) => {
  const lat = Number(p?.latitude)
  const lng = Number(p?.longitude)
  const order = Number(p?.order ?? 0)
  if (Number.isNaN(lat) || Number.isNaN(lng)) return
  activeMarkerId.value = p?.placeId ?? p?.id ?? `${order}-${lat}-${lng}`
}

const isActivePlace = (p) => {
  const lat = Number(p?.latitude)
  const lng = Number(p?.longitude)
  const order = Number(p?.order ?? 0)
  const id = p?.placeId ?? p?.id ?? `${order}-${lat}-${lng}`
  return String(activeMarkerId.value) === String(id)
}

watch(activeDay, () => {
  activeMarkerId.value = null
})

onMounted(async () => {
  if (!projectId.value) return
  await Promise.all([loadProject(), loadPlaces(), reloadItinerary()])
})
</script>
