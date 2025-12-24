<template>
  <section class="rounded-2xl border border-slate-200 bg-white">
    <div class="border-b border-slate-200 px-5 py-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            day editor
          </p>
          <h3 class="mt-1 text-[14px] font-bold text-slate-900">DAY {{ day }}</h3>
          <p class="mt-1 text-[12px] text-slate-600">
            드래그로 순서를 바꾸거나, 장소를 추가·삭제할 수 있어요.
          </p>
        </div>
      </div>

      <div v-if="error" class="mt-3 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">
        {{ error }}
      </div>
    </div>

    <div class="px-3 py-3">
      <div v-if="places.length === 0" class="p-6 text-center text-sm text-slate-500">
        이 날짜에 저장된 장소가 없습니다.
      </div>

      <button
        v-for="(p, idx) in places"
        :key="getId(p) + ':' + idx"
        type="button"
        class="cursor-pointer group mb-2 w-full rounded-xl border px-4 py-3 text-left transition"
        :class="
          getId(p) === activePlaceId
            ? 'border-transparent bg-[color:var(--color-primary)] text-white'
            : 'border-slate-200 bg-white hover:bg-slate-50'
        "
        draggable="true"
        @dragstart="onDragStart(idx)"
        @dragend="onDragEnd"
        @dragover.prevent="onDragOver(idx)"
        @drop.prevent="onDrop(idx)"
        @click="$emit('selectPlace', getId(p))"
      >
        <div class="flex items-start gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex items-start gap-3">
              <div class="shrink-0 relative">
                <div
                  class="h-12 w-12 overflow-hidden rounded-xl border"
                  :class="getId(p) === activePlaceId ? 'border-white/20' : 'border-slate-200'"
                >
                  <img
                    v-if="p.thumbnail"
                    :src="p.thumbnail"
                    alt="thumb"
                    class="h-full w-full object-cover"
                  />
                  <div v-else class="h-full w-full bg-slate-100"></div>
                </div>

                <span
                  class="absolute -left-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-extrabold shadow"
                  :class="
                    getId(p) === activePlaceId
                      ? 'bg-white/80 text-black ring-1 ring-white/25'
                      : 'bg-slate-900 text-white ring-1 ring-slate-200'
                  "
                >
                  {{ idx + 1 }}
                </span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex items-center gap-2">
                    <span
                      class="shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      :class="
                        getId(p) === activePlaceId
                          ? 'bg-white/15 text-white'
                          : 'bg-slate-100 text-slate-600'
                      "
                    >
                      {{ formatType(p.category ?? p.placeType) }}
                    </span>

                    <p class="min-w-0 truncate text-[14px] font-bold">
                      {{ p.name ?? p.placeName ?? '장소' }}
                    </p>
                  </div>

                  <button
                    type="button"
                    class="shrink-0 cursor-pointer rounded-lg px-2 py-1 text-[12px] font-semibold"
                    :class="
                      getId(p) === activePlaceId
                        ? 'text-rose-200 hover:bg-white/10'
                        : 'text-rose-600 hover:bg-rose-50'
                    "
                    @click.stop="$emit('removePlace', getId(p))"
                  >
                    삭제
                  </button>
                </div>

                <p
                  class="mt-1 min-w-0 truncate text-[12px]"
                  :class="getId(p) === activePlaceId ? 'text-white/80' : 'text-slate-600'"
                >
                  {{ p.address ?? p.placeAddress ?? '' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  day: { type: Number, default: 1 },
  places: { type: Array, default: () => [] },
  activePlaceId: { type: [String, Number], default: null },
  saving: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['selectPlace', 'movePlace', 'removePlace', 'saveDay'])

const getId = (p) => p?.id ?? p?.googlePlaceId ?? p?.placeId ?? ''

const dragFrom = ref(-1)
const dragOver = ref(-1)

const onDragStart = (fromIndex) => {
  dragFrom.value = fromIndex
}

const onDragOver = (overIndex) => {
  dragOver.value = overIndex
}

const onDrop = (toIndex) => {
  const fromIndex = dragFrom.value
  if (fromIndex < 0 || toIndex < 0) return
  if (fromIndex === toIndex) return
  emit('movePlace', { fromIndex, toIndex })
  dragFrom.value = -1
  dragOver.value = -1
}

const onDragEnd = () => {
  dragFrom.value = -1
  dragOver.value = -1
}

const formatType = (t) => {
  if (!t) return 'place'
  const s = String(t)
  return s.length > 10 ? s.slice(0, 10) + '…' : s
}

const rowClass = (p, idx) => {
  const active =
    getId(p) === props.activePlaceId
      ? 'border-slate-900 bg-slate-900 text-white'
      : 'border-slate-200 bg-white hover:bg-slate-50'

  const draggingHint =
    dragOver.value === idx && dragFrom.value !== -1 ? 'ring-2 ring-slate-300' : ''

  return [active, draggingHint].join(' ')
}
</script>
