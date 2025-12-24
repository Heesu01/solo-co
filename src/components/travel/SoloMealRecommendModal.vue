<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-[60]">
      <button type="button" class="absolute inset-0 bg-black/40" aria-label="닫기" @click="close" />

      <section
        class="absolute left-1/2 top-1/2 w-[92vw] max-w-[980px] -translate-x-1/2 -translate-y-1/2 max-h-[92vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <header class="border-b border-slate-200 px-6 py-4">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                solo meal recommend
              </p>
              <h2 class="mt-1 text-[18px] font-bold text-slate-900">혼밥 추천</h2>
              <p class="mt-1 text-[13px] text-slate-600">
                지도 위치 기반으로 추천된 식당을 선택하고 일정에 바로 추가할 수 있어요.
              </p>
            </div>

            <button
              type="button"
              class="cursor-pointer inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
              @click="close"
            >
              닫기
            </button>
          </div>
        </header>

        <div
          class="grid gap-0 md:grid-cols-[360px,1fr] overflow-auto"
          style="max-height: calc(92vh - 64px - 56px)"
        >
          <aside class="border-b border-slate-200 md:border-b-0 md:border-r">
            <div class="flex items-center justify-between px-5 py-3">
              <p class="text-[13px] font-semibold text-slate-800">
                추천 목록
                <span class="ml-1 text-[12px] font-semibold text-slate-500">
                  ({{ safeResults.length }})
                </span>
              </p>

              <button
                type="button"
                class="cursor-pointer inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="loading"
                @click="emit('refresh')"
              >
                새로고침
              </button>
            </div>

            <div class="px-5">
              <p
                v-if="error"
                class="rounded-xl bg-rose-50 p-3 text-[12px] font-semibold text-rose-700"
              >
                {{ error }}
              </p>

              <div v-else-if="loading" class="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                불러오는 중…
              </div>

              <div
                v-else-if="safeResults.length === 0"
                class="rounded-xl bg-slate-50 p-4 text-sm text-slate-600"
              >
                추천 결과가 없어요.
              </div>
            </div>

            <div class="max-h-[520px] overflow-auto px-3 pb-5">
              <button
                v-for="item in safeResults"
                :key="item.placeId"
                type="button"
                class="cursor-pointer group mb-2 w-full rounded-xl border px-3 py-3 text-left transition"
                :class="
                  item.placeId === selectedId
                    ? 'border-slate-900 bg-slate-900/5'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                "
                @click="emit('select', item.placeId)"
              >
                <div class="flex gap-3">
                  <div class="h-14 w-14 flex-none overflow-hidden rounded-xl bg-slate-100">
                    <img
                      v-if="firstPhoto(item)"
                      :src="firstPhoto(item)"
                      alt=""
                      class="h-full w-full object-cover"
                      loading="lazy"
                      referrerpolicy="no-referrer"
                    />
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="truncate text-[14px] font-bold text-slate-900">
                      {{ item.name || '이름 없음' }}
                    </p>
                    <p class="mt-0.5 line-clamp-2 text-[12px] text-slate-600">
                      {{ item.formattedAddress || '' }}
                    </p>

                    <div class="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        class="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                      >
                        혼밥 {{ normalizeScore(item.soloDifficulty) }}
                      </span>
                      <span
                        v-if="typeof item.rating === 'number'"
                        class="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                      >
                        평점 {{ item.rating.toFixed(1) }}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </aside>

          <main class="min-w-0 px-6 py-5">
            <div class="space-y-5">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <h3 class="truncate text-[18px] font-bold text-slate-900">
                    {{ selectedPlace.name || '이름 없음' }}
                  </h3>
                  <p class="mt-1 text-[13px] text-slate-600">
                    {{ selectedPlace.formattedAddress || '' }}
                  </p>

                  <div class="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      class="inline-flex items-center rounded-xl bg-slate-900 px-3 py-1 text-[12px] font-bold text-white"
                    >
                      혼밥 {{ normalizeScore(selectedPlace.soloDifficulty) }}점
                    </span>

                    <span
                      v-if="typeof selectedPlace.rating === 'number'"
                      class="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1 text-[12px] font-semibold text-slate-700"
                    >
                      평점 {{ selectedPlace.rating.toFixed(1) }}
                    </span>
                  </div>
                  <span
                    v-for="t in tagList"
                    :key="t"
                    class="mt-3 mr-2 inline-flex items-center rounded-xl bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-700"
                  >
                    {{ t }}
                  </span>
                </div>

                <button
                  type="button"
                  class="cursor-pointer inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-start to-end px-5 text-[14px] font-bold text-white shadow-lg transition hover:from-start-hover hover:to-end-hover disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="!selectedPlace"
                  @click="onAdd"
                >
                  일정에 추가
                </button>
              </div>

              <div v-if="photos.length" class="grid grid-cols-3 gap-2 md:grid-cols-4">
                <div
                  v-for="(url, idx) in photos"
                  :key="url + idx"
                  class="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100"
                >
                  <img
                    :src="url"
                    alt=""
                    class="h-full w-full object-cover"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                  />
                </div>
              </div>

              <section class="rounded-2xl border border-slate-200 bg-white p-4">
                <p class="text-[13px] font-bold text-slate-900">점수 근거</p>
                <p class="mt-2 text-[13px] leading-relaxed text-slate-700">
                  {{ selectedPlace.scoreJustification || '근거 정보가 없어요.' }}
                </p>
              </section>
            </div>
          </main>
        </div>
      </section>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },

  results: { type: Array, default: () => [] },

  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },

  selectedId: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'select', 'add', 'refresh'])

const safeResults = computed(() => (Array.isArray(props.results) ? props.results : []))

const selectedPlace = computed(
  () => safeResults.value.find((x) => x?.placeId === props.selectedId) ?? null,
)

const photos = computed(() => {
  const list = selectedPlace.value?.photoUrls
  return Array.isArray(list) ? list.slice(0, 8) : []
})

const tagList = computed(() => {
  const list = selectedPlace.value?.tags
  return Array.isArray(list) ? list.slice(0, 8).filter(Boolean) : []
})

const close = () => emit('update:modelValue', false)

const normalizeScore = (v) => {
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  if (n < 0) return 0
  if (n > 100) return 100
  return Math.round(n)
}

const firstPhoto = (item) => {
  const list = item?.photoUrls
  if (!Array.isArray(list) || !list.length) return ''
  return list[0]
}

const onAdd = () => {
  if (!selectedPlace.value) return
  emit('add', selectedPlace.value)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 160ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
