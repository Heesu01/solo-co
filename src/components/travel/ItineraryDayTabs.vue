<template>
  <div class="space-y-2">
    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">days</p>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="d in days"
        :key="d"
        type="button"
        class="cursor-pointer rounded-xl border px-3 py-2 text-left transition"
        :class="
          d === activeDay
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-slate-200 bg-white hover:bg-slate-50'
        "
        @click="$emit('selectDay', d)"
      >
        <div class="flex items-center gap-2">
          <span class="text-[12px] font-bold">DAY {{ d }}</span>
          <span
            v-if="countMap[d] != null"
            class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
            :class="d === activeDay ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600'"
          >
            {{ countMap[d] }}곳
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  days: { type: Array, default: () => [] },
  activeDay: { type: Number, default: 1 },
  counts: { type: Object, default: () => ({}) },
})

defineEmits(['selectDay'])

const countMap = computed(() => {
  const c = props.counts
  return c && typeof c === 'object' ? c : {}
})
</script>
