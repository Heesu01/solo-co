<template>
  <div class="min-h-screen bg-slate-50">
    <div class="w-full px-3 pt-20 pb-10 md:px-6 pt-30">
      <div class="mx-auto max-w-[1400px]">
        <div class="grid gap-6 items-start" style="grid-template-columns: 360px 1fr">
          <GroupSidebar @manage-member="onManageMember" />

          <main class="min-w-0">
            <section class="border border-slate-200 bg-white">
              <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <div>
                  <span class="tracking-[0.18em] font-semibold">COMMUNITY</span>
                  <p class="mt-0.5 text-[12px] text-slate-500">게시글로 사진·정보를 공유해요.</p>
                </div>

                <div class="flex items-center gap-2">
                  <div class="flex items-center border border-slate-200 px-3 py-2">
                    <input
                      v-model="postQuery"
                      placeholder="검색"
                      class="w-56 md:w-72 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    class="cursor-pointer bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                    @click="goCreatePost"
                  >
                    글 작성
                  </button>
                </div>
              </div>

              <div v-if="loading" class="p-12 text-center text-slate-500">불러오는 중...</div>
              <div v-else-if="errorMsg" class="p-12 text-center text-rose-600">
                {{ errorMsg }}
              </div>

              <div v-else>
                <div v-if="filteredPosts.length === 0" class="p-12 text-center text-slate-500">
                  <p class="text-sm font-semibold text-slate-800">게시글이 없어요</p>
                  <p class="mt-1 text-[12px]">첫 글을 작성해보세요.</p>
                </div>

                <ul v-else class="divide-y divide-slate-200">
                  <li
                    v-for="p in filteredPosts"
                    :key="p.postId"
                    class="group flex items-start gap-4 px-4 py-4 cursor-pointer hover:bg-slate-50"
                    @click="goPostDetail(p.postId)"
                  >
                    <div class="min-w-0 flex-1">
                      <h3
                        class="truncate text-[14px] font-semibold text-slate-900 group-hover:underline"
                      >
                        {{ p.title }}
                      </h3>

                      <div class="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                        <span class="font-medium text-slate-700">{{ p.author }}</span>
                        <!-- <span>·</span> -->
                        <!-- <span>{{ p.date }}</span> -->
                      </div>

                      <p class="mt-2 line-clamp-2 text-[12px] leading-relaxed text-slate-600">
                        {{ p.content }}
                      </p>

                      <div class="mt-2 flex flex-wrap gap-1.5">
                        <span
                          v-for="t in p.tags"
                          :key="t"
                          class="bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600"
                        >
                          #{{ t }}
                        </span>
                      </div>
                    </div>

                    <div
                      v-if="p.image"
                      class="h-20 w-28 shrink-0 overflow-hidden bg-slate-100 ring-1 ring-slate-200"
                    >
                      <img
                        :src="p.image"
                        alt=""
                        class="h-full w-full object-cover transition group-hover:scale-[1.02]"
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            <main class="min-w-0 mt-5">
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
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import GroupSidebar from '@/components/group/GroupSidebar.vue'
import { fetchTravelPosts } from '@/api/project'
import ItineraryMap from '@/components/travel/GoogleMapItinerary.vue'
import { fetchItinerary } from '@/api/travel'

const router = useRouter()
const route = useRoute()

const projectId = computed(() => Number(route.params.id))

const postQuery = ref('')
const posts = ref([])
const loading = ref(false)
const errorMsg = ref('')

const normalizeListItem = (p) => ({
  postId: p.postId,
  title: p.title,
  content: p.contentPreview,
  author: p.authorName,
  authorProfileImage: p.authorProfileImage,
  tags: p.tags || [],
  image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '',
})

const loadPosts = async () => {
  if (!projectId.value) return
  loading.value = true
  errorMsg.value = ''

  try {
    const res = await fetchTravelPosts({
      projectId: projectId.value,
      query: postQuery.value.trim(),
    })

    const list = Array.isArray(res?.data) ? res.data : []
    posts.value = list
  } catch (e) {
    console.error('[CommunityList] fetch error:', e)
    errorMsg.value = '게시글 목록을 불러오지 못했어요.'
    posts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadPosts)

let t = null
watch(postQuery, () => {
  if (t) clearTimeout(t)
  t = setTimeout(() => loadPosts(), 250)
})
onBeforeUnmount(() => {
  if (t) clearTimeout(t)
})

const filteredPosts = computed(() => posts.value.map(normalizeListItem))

const goCreatePost = () => {
  router.push(`/group/${route.params.id}/create`)
}

const goPostDetail = (postId) => {
  router.push(`/group/${route.params.id}/community/${postId}`)
}

const onManageMember = (m) => alert(`${m.name} 멤버 관리 UI를 여기서 열면 돼요.`)
const project = ref(null)
const members = ref([])
const places = ref([])
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

const goToItineraryEdit = () => router.push(`/group/${projectId.value}/itinerary`)

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
