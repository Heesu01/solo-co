<template>
  <aside class="space-y-4">
    <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div class="relative h-40 bg-slate-100">
        <img
          v-if="project?.thumbnail"
          :src="project.thumbnail"
          alt="cover"
          class="h-full w-full object-cover"
          loading="lazy"
          referrerpolicy="no-referrer"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-white/70"></div>
      </div>

      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-[11px] font-semibold tracking-[0.14em] text-slate-400">SOLO TRIP</p>
            <h1 class="mt-1 truncate text-[15px] font-semibold text-slate-900">
              {{ project?.title || (projectId ? '불러오는 중…' : '') }}
            </h1>
          </div>

          <span
            class="shrink-0 inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold"
            :class="statusChipClass"
          >
            {{ statusLabel }}
          </span>
        </div>

        <div class="mt-3 space-y-2 text-[12px] text-slate-700">
          <div class="flex items-center gap-2">
            <MapPinIcon class="h-4 w-4 text-slate-400" />
            <span class="truncate">{{ project?.location || '-' }}</span>
          </div>

          <div class="flex items-center gap-2">
            <CalendarDaysIcon class="h-4 w-4 text-slate-400" />
            <p class="font-medium text-slate-700">
              {{ project?.startDate || '-' }} ~ {{ project?.endDate || '-' }}
            </p>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-200"></div>

      <div class="p-4">
        <!-- <div class="flex items-end justify-between">
          <h2 class="text-sm font-semibold text-slate-900">저장한 장소</h2>
          <p class="text-[12px] text-slate-500">{{ placesCount }}개</p>
        </div>
        <p class="mt-1 text-[12px] text-slate-500">프로젝트에 담긴 장소 목록</p>

        <div class="mt-3">
          <div v-if="placesLoading" class="py-4 text-[12px] text-slate-400">불러오는 중…</div>
          <div v-else-if="placesError" class="py-4 text-[12px] font-medium text-rose-600">
            장소를 불러오지 못했습니다.
          </div>
          <div v-else-if="places.length === 0" class="py-4 text-[12px] text-slate-400">
            저장한 장소가 없습니다.
          </div>

          <ul v-else class="space-y-1">
            <li
              v-for="p in places.slice(0, maxPreview)"
              :key="p.placeId ?? p.id"
              class="rounded-lg px-2 py-2 hover:bg-slate-50"
            >
              <p class="truncate text-[13px] font-semibold text-slate-900">
                {{ p.placeName ?? p.name ?? '장소' }}
              </p>
              <p class="truncate text-[11px] text-slate-500">
                {{ p.address ?? p.placeAddress ?? '-' }}
              </p>
            </li>
          </ul>
        </div> -->

        <!-- <div class="mt-4 border-t border-slate-200 pt-5"> -->
        <div class="pt-2">
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              class="cursor-pointer flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!projectId"
              @click="$emit('itineraryEdit')"
            >
              일정 상세보기
            </button>

            <button
              type="button"
              class="cursor-pointer flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-start to-end text-sm font-semibold text-white shadow-md transition hover:from-start-hover hover:to-end-hover disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!projectId"
              @click="$emit('travelManage')"
            >
              일정 짜기
            </button>
          </div>

          <p class="mt-2 text-[11px] text-slate-500">
            장소를 담고 일정 후보를 만들거나, 생성된 일정을 수정할 수 있어요.
          </p>
        </div>
      </div>
    </section>
  </aside>
</template>

<script setup>
// import { computed } from 'vue'
import { MapPinIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  projectId: { type: Number, default: 0 },
  project: { type: Object, default: null },

  places: { type: Array, default: () => [] },
  placesLoading: { type: Boolean, default: false },
  placesError: { type: Boolean, default: false },

  statusLabel: { type: String, default: '예정' },
  statusChipClass: { type: String, default: 'bg-sky-50 text-sky-700' },

  maxPreview: { type: Number, default: 8 },
})

defineEmits(['itineraryEdit', 'travelManage'])

// const placesCount = computed(() => (Array.isArray(props.places) ? props.places.length : 0))
</script>
