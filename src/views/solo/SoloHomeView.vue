<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-6xl px-4 pt-24 pb-16 md:px-6">
      <section
        class="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-400 px-7 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12 shadow-[0_20px_40px_rgba(15,23,42,0.25)]"
      >
        <div
          class="pointer-events-none absolute -right-16 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        />
        <div
          class="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-pink-200/30 blur-2xl"
        />

        <div class="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-4 text-white">
            <p class="text-xs font-semibold tracking-[0.28em] uppercase text-white/90">
              SOLO&CO SOLO Travel
            </p>

            <h1
              class="font-title text-[32px] leading-tight drop-shadow-md md:text-[40px] lg:text-[44px]"
            >
              혼자 떠나는 여행
            </h1>

            <p class="text-sm leading-relaxed text-white/90 md:text-[15px]">
              저장한 장소를 바탕으로 AI가 후보 코스를 만들고,<br class="hidden md:block" />
              <span class="font-semibold">치안·교통·경로 단순성·관광지 접근성</span>과
              <span class="font-semibold">혼밥 난이도</span>까지 함께 점수로 보여드려요.
            </p>

            <div class="flex flex-wrap gap-2 text-[11px]">
              <span
                class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 backdrop-blur"
              >
                🛡️ 치안 점수 제공
              </span>
              <span
                class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 backdrop-blur"
              >
                🚇 교통·접근성 제공
              </span>

              <span
                class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 backdrop-blur"
              >
                🍽️ 혼밥 난이도 제공
              </span>
            </div>
          </div>

          <div class="flex flex-col items-end gap-4 lg:min-w-[280px]">
            <button
              type="button"
              class="cursor-pointer inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-fuchsia-700 shadow-lg transition hover:bg-white"
              @click="handleCreateSolo"
            >
              <span
                class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 text-white text-base"
              >
                +
              </span>
              새로운 개인 여행 만들기
            </button>

            <div
              class="w-full max-w-xs rounded-3xl bg-white/95 px-7 py-3 text-xs text-slate-600 shadow-[0_16px_35px_rgba(15,23,42,0.25)] backdrop-blur"
            >
              <p class="mb-1 text-[11px] font-semibold text-slate-500">오늘의 개인 여행 팁</p>

              <div class="space-y-1.5 leading-relaxed">
                <p class="text-[11px] text-slate-500">
                  저장한 장소를 바탕으로 AI가 여행 코스를 추천해요. <br />
                  <span class="text-fuchsia-500 font-bold">혼밥, 치안, 교통</span> 등 여행에 중요한
                  기준을 함께 고려해요.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative mt-8">
          <div
            class="flex items-center gap-3 rounded-full bg-white/95 px-5 py-3 shadow-[0_18px_30px_rgba(15,23,42,0.18)]"
          >
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-slate-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="6" />
                <path d="m16 16 4 4" />
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="여행 제목, 장소, 날짜를 검색해 보세요"
              class="h-9 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      <section class="mt-10 space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="space-y-1">
            <h2 class="text-sm font-semibold text-slate-800">나의 개인 여행</h2>
            <p class="text-[11px] text-slate-400">
              예정 {{ upcomingCount }}건 · 진행 중 {{ ongoingCount }}건 · 완료
              {{ completedCount }}건
            </p>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <button
              class="cursor-pointer rounded-full border px-3 py-1.5"
              :class="
                sortKey === 'recent'
                  ? 'border-fuchsia-400 text-fuchsia-700'
                  : 'border-slate-200 text-slate-600'
              "
              @click="sortKey = 'recent'"
            >
              최신순
            </button>

            <button
              class="cursor-pointer rounded-full border px-3 py-1.5"
              :class="
                sortKey === 'old'
                  ? 'border-fuchsia-400 text-fuchsia-700'
                  : 'border-slate-200 text-slate-600'
              "
              @click="sortKey = 'old'"
            >
              오래된순
            </button>

            <button
              class="cursor-pointer rounded-full border px-3 py-1.5"
              :class="
                sortKey === 'status'
                  ? 'border-fuchsia-400 text-fuchsia-700'
                  : 'border-slate-200 text-slate-600'
              "
              @click="sortKey = 'status'"
            >
              상태별 정렬
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="text-[12px] text-slate-400">
          개인 여행을 불러오는 중입니다...
        </div>
        <div v-else-if="isError" class="text-[12px] text-rose-500">
          데이터를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </div>
        <div v-else-if="sortedTrips.length === 0" class="text-[12px] text-slate-400">
          아직 만든 개인 여행이 없어요. 새로운 그룹 여행을 만들어볼까요?
        </div>

        <div
          v-if="!isLoading && !isError && sortedTrips.length > 0"
          class="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          <SoloTripCard
            v-for="trip in sortedTrips"
            :key="trip.id"
            :trip="trip"
            @enter="handleEnterTrip"
            @delete="handleDelete"
            @update="handleUpdateTrip"
          />

          <button
            type="button"
            class="cursor-pointer flex min-h-[180px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 text-xs text-slate-400 transition hover:border-fuchsia-400 hover:bg-fuchsia-50/50 hover:text-fuchsia-700"
            @click="handleCreateSolo"
          >
            <span
              class="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <span
                class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 text-base font-semibold text-white"
              >
                +
              </span>
            </span>
            <span class="font-medium">새 솔로 여행 프로젝트 추가</span>
            <span class="mt-1 text-[11px] text-slate-400">
              여행 이름과 인원만 적으면 바로 시작할 수 있어요
            </span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SoloTripCard from '@/components/solo/SoloTripCard.vue'
import { fetchSoloProjects, updateTravel, deleteTravel } from '@/api/project'

const router = useRouter()

const searchQuery = ref('')
const sortKey = ref('recent')

const trips = ref([])
const isLoading = ref(false)
const isError = ref(false)

const loadSoloTrips = async () => {
  isLoading.value = true
  isError.value = false

  try {
    const res = await fetchSoloProjects()
    const data = res.data || []

    trips.value = data.map((item) => {
      const start = item.startDate
      const end = item.endDate

      return {
        id: item.projectId,
        projectId: item.projectId,
        projectType: item.projectType ?? 'SOLO',

        title: item.title ?? '',
        location: item.location ?? '',
        startDate: start,
        endDate: end,
        dateLabel: start && end ? `${start} ~ ${end}` : '',

        thumbnail: item.thumbnail ?? '',
        status: item.status ?? 'UPCOMING',
        createdAt: start ?? '',
      }
    })
  } catch (e) {
    console.error('솔로 여행 조회 실패:', e)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(loadSoloTrips)

const filteredTrips = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let base = trips.value

  if (q) {
    base = base.filter((trip) => {
      const title = (trip.title || '').toLowerCase()
      const location = (trip.location || '').toLowerCase()
      const dateLabel = (trip.dateLabel || '').toLowerCase()
      return title.includes(q) || location.includes(q) || dateLabel.includes(q)
    })
  }

  return base
})

const sortedTrips = computed(() => {
  const base = [...filteredTrips.value]

  if (sortKey.value === 'recent') {
    return base.sort((a, b) => (a.startDate < b.startDate ? 1 : -1))
  }

  if (sortKey.value === 'old') {
    return base.sort((a, b) => (a.startDate > b.startDate ? 1 : -1))
  }

  if (sortKey.value === 'status') {
    const order = { UPCOMING: 0, IN_PROGRESS: 1, DONE: 2 }
    return base.sort((a, b) => (order[a.status] ?? 99) - (order[b.status] ?? 99))
  }

  return base
})

const upcomingCount = computed(
  () => filteredTrips.value.filter((t) => t.status === 'UPCOMING').length,
)
const ongoingCount = computed(
  () => filteredTrips.value.filter((t) => t.status === 'IN_PROGRESS').length,
)
const completedCount = computed(() => filteredTrips.value.filter((t) => t.status === 'DONE').length)

const handleCreateSolo = () => {
  router.push('/solo/create')
}

const handleEnterTrip = (trip) => {
  router.push(`/solo/${trip.id}`)
}

const handleUpdateTrip = async ({ id, dto, thumbnail }) => {
  try {
    await updateTravel({
      projectId: id,
      dto,
      thumbnailFile: thumbnail || null,
    })
    await loadSoloTrips()
  } catch (e) {
    console.error('개인 여행 수정 실패:', e)
    alert('여행 정보를 수정하는 데 실패했어요. 잠시 후 다시 시도해 주세요.')
  }
}

const handleDelete = async (id) => {
  const ok = window.confirm('정말 이 여행을 삭제할까요? 삭제하면 복구할 수 없습니다.')
  if (!ok) return

  try {
    await deleteTravel(id)
    trips.value = trips.value.filter((t) => t.id !== id)
  } catch (e) {
    console.error('개인 여행 삭제 실패:', e)
    alert('여행을 삭제하는 데 실패했어요. 잠시 후 다시 시도해 주세요.')
  }
}
</script>
