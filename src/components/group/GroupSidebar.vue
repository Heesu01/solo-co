<template>
  <aside class="space-y-4">
    <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div class="relative h-40 bg-slate-100">
        <img
          v-if="group?.thumbnail"
          :src="group.thumbnail"
          alt="cover"
          class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-white/70"></div>
      </div>

      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-[11px] font-semibold tracking-[0.14em] text-slate-400">GROUP TRIP</p>
            <h1 class="mt-1 truncate text-[15px] font-semibold text-slate-900">
              {{ group?.title }}
            </h1>
          </div>

          <span
            class="shrink-0 inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold"
            :class="statusChipClass(group?.status)"
          >
            {{ statusLabel(group?.status) }}
          </span>
        </div>

        <div class="mt-3 space-y-2 text-[12px] text-slate-700">
          <div class="flex items-center gap-2">
            <MapPinIcon class="h-4 w-4 text-slate-400" />
            <span class="truncate">{{ group?.location }}</span>
          </div>

          <div class="flex items-center gap-2">
            <CalendarDaysIcon class="h-4 w-4 text-slate-400" />
            <p class="font-medium text-slate-700">{{ group?.startDate }} ~ {{ group?.endDate }}</p>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-200"></div>

      <div class="p-4">
        <div class="flex items-end justify-between">
          <h2 class="text-sm font-semibold text-slate-900">멤버</h2>
          <p class="text-[12px] text-slate-500">{{ members?.length ?? 0 }}명</p>
        </div>
        <p class="mt-1 text-[12px] text-slate-500">참여 멤버 관리</p>

        <ul class="mt-3 space-y-1">
          <li
            v-for="m in members"
            :key="m.id"
            class="group flex items-center justify-between rounded-lg px-2 py-2 hover:bg-slate-50"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="h-8 w-8 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
                <img v-if="m.avatar" :src="m.avatar" class="h-full w-full object-cover" />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500"
                >
                  {{ initials(m.name) }}
                </div>
              </div>

              <div class="min-w-0">
                <p class="truncate text-[13px] font-semibold text-slate-900">
                  {{ m.name }}
                  <span
                    v-if="m.role === 'OWNER'"
                    class="ml-1 rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700"
                  >
                    방장
                  </span>
                </p>
                <p class="truncate text-[11px] text-slate-500">{{ m.email }}</p>
              </div>
            </div>

            <button
              class="rounded-md px-2 py-1 text-[11px] font-medium text-slate-600 opacity-0 transition group-hover:opacity-100 hover:bg-white hover:text-slate-800"
              type="button"
              @click.stop="$emit('manage-member', m)"
            >
              관리
            </button>
          </li>
        </ul>
      </div>
    </section>
  </aside>
</template>

<script setup>
import { MapPinIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'

defineProps({
  group: { type: Object, required: true },
  members: { type: Array, default: () => [] },
})

defineEmits(['manage-member'])

const initials = (name = '') => name.trim().slice(0, 1) || '?'

const statusLabel = (s) => {
  if (s === 'UPCOMING') return '예정'
  if (s === 'IN_PROGRESS') return '진행중'
  if (s === 'DONE') return '완료'
  return '상태'
}

const statusChipClass = (s) => {
  if (s === 'IN_PROGRESS') return 'bg-emerald-50 text-emerald-700'
  if (s === 'DONE') return 'bg-slate-100 text-slate-600'
  return 'bg-sky-50 text-sky-700'
}
</script>
