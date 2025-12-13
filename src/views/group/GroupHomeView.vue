<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-6xl px-4 pt-24 pb-16 md:px-6">
      <section
        class="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-500 via-sky-500 to-sky-400 px-7 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12 shadow-[0_20px_40px_rgba(15,23,42,0.25)]"
      >
        <div
          class="pointer-events-none absolute -right-16 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        />
        <div
          class="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-sky-200/30 blur-2xl"
        />

        <div class="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-4 text-white">
            <p class="text-xs font-semibold tracking-[0.28em] uppercase text-sky-100/90">
              SOLO&CO GROUP TRAVEL
            </p>
            <h1
              class="font-title text-[32px] leading-tight drop-shadow-md md:text-[40px] lg:text-[44px]"
            >
              함께 떠나는 여행
            </h1>
            <p class="text-sm leading-relaxed text-sky-50/90 md:text-[15px]">
              친구, 동료, 가족과 함께 떠나는 단체 여행 프로젝트를 한 곳에서 관리해 보세요.<br
                class="hidden md:block"
              />
              여행 준비 단계부터 일정 확정, 완료된 여행 기록까지 모두 Solo&Co가 챙겨줄게요.
            </p>

            <div class="flex flex-wrap gap-2 text-[11px]">
              <span
                class="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-medium backdrop-blur"
              >
                ✨ 그룹 여행 프로젝트
              </span>
              <span
                class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 backdrop-blur"
              >
                👥 인원, 장소, 일정 한 번에
              </span>
            </div>
          </div>

          <div class="flex flex-col items-end gap-4 lg:min-w-[260px]">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-sky-600 shadow-lg transition hover:bg-white"
              @click="handleCreateGroup"
            >
              <span
                class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white text-base"
              >
                +
              </span>
              새로운 그룹 여행 만들기
            </button>

            <div
              class="w-full max-w-xs rounded-3xl bg-white/95 px-4 py-3 text-xs text-slate-600 shadow-[0_16px_35px_rgba(15,23,42,0.25)] backdrop-blur"
            >
              <p class="mb-1 text-[11px] font-semibold text-slate-500">오늘의 그룹 여행 팁</p>
              <p class="leading-relaxed">
                시작 전, 함께 가는 사람들과
                <span class="font-semibold text-sky-600">여행 스타일</span>을 먼저 맞춰보면 일정
                조율이 훨씬 쉬워져요.
              </p>
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
              placeholder="여행 제목, 장소, 메모 등을 검색해 보세요"
              class="h-9 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      <section class="mt-10 space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="space-y-1">
            <h2 class="text-sm font-semibold text-slate-800">나의 그룹 여행</h2>
            <p class="text-[11px] text-slate-400">
              진행 중 {{ ongoingCount }}건 · 완료 {{ completedCount }}건
            </p>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <button
              class="rounded-full border px-3 py-1.5"
              :class="
                sortKey === 'recent'
                  ? 'border-sky-400 text-sky-600'
                  : 'border-slate-200 text-slate-600'
              "
              @click="sortKey = 'recent'"
            >
              최신순
            </button>

            <button
              class="rounded-full border px-3 py-1.5"
              :class="
                sortKey === 'old'
                  ? 'border-sky-400 text-sky-600'
                  : 'border-slate-200 text-slate-600'
              "
              @click="sortKey = 'old'"
            >
              오래된순
            </button>

            <button
              class="rounded-full border px-3 py-1.5"
              :class="
                sortKey === 'status'
                  ? 'border-sky-400 text-sky-600'
                  : 'border-slate-200 text-slate-600'
              "
              @click="sortKey = 'status'"
            >
              상태별 정렬
            </button>
          </div>
        </div>

        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <TripCard
            v-for="trip in sortedTrips"
            :key="trip.id"
            :trip="trip"
            @enter="handleEnterTrip"
            @delete="handleDelete"
          />

          <button
            type="button"
            class="flex min-h-[180px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 text-xs text-slate-400 transition hover:border-sky-400 hover:bg-sky-50/50 hover:text-sky-600"
            @click="handleCreateGroup"
          >
            <span
              class="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <span
                class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-base font-semibold text-white"
              >
                +
              </span>
            </span>
            <span class="font-medium">새 그룹 여행 프로젝트 추가</span>
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import TripCard from '@/components/group/TripCard.vue'

const router = useRouter()

const searchQuery = ref('')
const sortKey = ref('recent')

const trips = ref([
  {
    projectId: 1,
    projectType: 'GROUP',
    id: 1,
    title: '제주도 3박 4일 친구여행',
    location: '제주',
    startDate: '2025-03-01',
    endDate: '2025-03-04',
    dateLabel: '2025-03-01 ~ 2025-03-04',
    thumbnail: 'https://yourcdn.com/images/tokyo_main.jpg',
    status: 'UPCOMING',
    createdAt: '2025-02-01',
    members: 4,
  },
  {
    projectId: 2,
    projectType: 'GROUP',
    id: 2,
    title: '퇴사 기념 오사카 먹방 투어',
    location: '오사카',
    startDate: '2025-02-10',
    endDate: '2025-02-13',
    dateLabel: '2025-02-10 ~ 2025-02-13',
    thumbnail: 'https://yourcdn.com/images/tokyo_main.jpg',
    status: 'IN_PROGRESS',
    createdAt: '2025-02-05',
    members: 3,
  },
  {
    projectId: 3,
    projectType: 'GROUP',
    id: 3,
    title: '부산 바다 힐링 주말여행',
    location: '부산',
    startDate: '2025-01-18',
    endDate: '2025-01-19',
    dateLabel: '2025-01-18 ~ 2025-01-19',
    thumbnail: 'https://yourcdn.com/images/tokyo_main.jpg',
    status: 'DONE',
    createdAt: '2025-01-01',
    members: 3,
  },
  {
    projectId: 4,
    projectType: 'GROUP',
    id: 4,
    title: '도쿄 벚꽃 야경 여행',
    location: '도쿄',
    startDate: '2025-04-02',
    endDate: '2025-04-06',
    dateLabel: '2025-04-02 ~ 2025-04-06',
    thumbnail: 'https://yourcdn.com/images/tokyo_main.jpg',
    status: 'UPCOMING',
    createdAt: '2025-02-20',
    members: 2,
  },
  {
    projectId: 5,
    projectType: 'GROUP',
    id: 5,
    title: '강릉 겨울 바다 감성 여행',
    location: '강릉',
    startDate: '2025-01-05',
    endDate: '2025-01-07',
    dateLabel: '2025-01-05 ~ 2025-01-07',
    thumbnail: 'https://yourcdn.com/images/tokyo_main.jpg',
    status: 'DONE',
    createdAt: '2024-12-15',
    members: 2,
  },
])

const filteredTrips = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()

  let base = trips.value.filter((trip) => trip.projectType === 'GROUP')

  if (q) {
    base = base.filter((trip) => {
      return (
        trip.title.toLowerCase().includes(q) ||
        trip.location.toLowerCase().includes(q) ||
        trip.dateLabel.toLowerCase().includes(q)
      )
    })
  }

  return base
})

const sortedTrips = computed(() => {
  const base = [...filteredTrips.value]

  if (sortKey.value === 'recent') {
    return base.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  }

  if (sortKey.value === 'old') {
    return base.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
  }

  if (sortKey.value === 'status') {
    const order = { UPCOMING: 0, IN_PROGRESS: 1, DONE: 2 }
    return base.sort((a, b) => order[a.status] - order[b.status])
  }

  return base
})

const ongoingCount = computed(() => trips.value.filter((t) => t.status === 'IN_PROGRESS').length)
const completedCount = computed(() => trips.value.filter((t) => t.status === 'DONE').length)

const handleCreateGroup = () => {
  router.push('/group/create')
}

const handleEnterTrip = (trip) => {
  router.push(`/group/${trip.id}`)
}

const handleDelete = (id) => {
  trips.value = trips.value.filter((t) => t.id !== id)
}
</script>
