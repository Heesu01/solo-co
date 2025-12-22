<template>
  <div
    class="max-h-[calc(100vh-7.5rem)] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur"
  >
    <!-- 검색창 -->
    <div class="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-5 py-3">
      <div class="mt-1 flex gap-2">
        <input
          :value="query"
          class="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
          :placeholder="loading ? '검색 중...' : '예: 성수 카페'"
          @input="$emit('updateQuery', $event.target.value)"
          @keydown.enter.prevent="$emit('search')"
        />
        <button
          type="button"
          class="cursor-pointer shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
          @click="$emit('search')"
        >
          검색
        </button>
      </div>
    </div>

    <!-- 검색 결과 -->
    <div class="shrink-0 px-3 py-3">
      <div class="flex items-center justify-between px-2">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            results
          </p>
        </div>
        <span v-if="results?.length" class="text-[12px] font-semibold text-slate-500">
          {{ results.length }}개
        </span>
      </div>

      <div class="mt-3 max-h-[270px] overflow-auto px-2 pb-2">
        <div v-if="loading" class="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          검색 중...
        </div>

        <div v-else-if="error" class="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
          {{ error }}
        </div>

        <div
          v-else-if="!results || results.length === 0"
          class="rounded-xl bg-slate-50 p-4 text-sm text-slate-600"
        >
          검색 결과가 없습니다.
        </div>

        <button
          v-for="r in results"
          :key="r.placeId"
          type="button"
          class="cursor-pointer mb-2 w-full rounded-xl border px-4 py-3 text-left transition"
          :class="
            r.placeId === activeId
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          "
          @click="$emit('select', r.placeId)"
        >
          <p class="truncate text-[14px] font-bold">{{ r.name }}</p>
          <p
            class="mt-1 line-clamp-2 text-[12px]"
            :class="r.placeId === activeId ? 'text-white/80' : 'text-slate-600'"
          >
            {{ r.address }}
          </p>
          <span
            class="mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold"
            :class="
              r.placeId === activeId ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600'
            "
          >
            {{ r.category ?? 'place' }}
          </span>
        </button>
      </div>
    </div>

    <!-- 상세 정보 -->
    <div class="flex-1 min-h-0 border-t border-slate-200 bg-white/95 px-5 py-4 flex flex-col">
      <div class="shrink-0 flex items-start justify-between gap-3">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">detail</p>
          <p v-if="detail" class="mt-1 text-[15px] font-extrabold text-slate-900">
            {{ detail.name }}
          </p>
          <p v-if="detail" class="mt-1 text-[12px] text-slate-600">
            {{ detail.address }}
          </p>
        </div>

        <button
          v-if="detail"
          type="button"
          class="cursor-pointer shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 active:scale-95"
          @click="$emit('addDetail')"
          title="담은 장소에 추가"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5 text-[#1d4ed8]"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <path d="M12 5v14M5 12h14" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div v-if="!detail" class="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        마커(또는 목록)를 클릭하면 상세가 여기에 표시됩니다.
      </div>

      <div v-else class="mt-3 flex-1 min-h-0 overflow-auto pr-1">
        <div v-if="detail.photos?.length" class="mt-2">
          <p class="text-[12px] font-semibold text-slate-700">사진</p>
          <div class="mt-2 flex gap-2 overflow-x-auto pb-2">
            <img
              v-for="(src, idx) in detail.photos"
              :key="src + idx"
              :src="src"
              alt="place photo"
              class="h-24 w-32 shrink-0 rounded-xl object-cover border border-slate-200"
              loading="lazy"
            />
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <span
            class="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
          >
            {{ detail.category ?? 'place' }}
          </span>

          <span
            v-if="detail.phone"
            class="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
          >
            {{ detail.phone }}
          </span>

          <span
            v-if="detail.rating"
            class="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
          >
            ★ {{ detail.rating }}
          </span>
        </div>

        <p v-if="detail.openingHours" class="mt-3 text-[12px] text-slate-600">
          <span class="font-semibold text-slate-700">영업:</span>
          {{ detail.openingHours }}
        </p>

        <a
          v-if="detail.website"
          class="mt-2 block truncate text-[12px] font-semibold text-sky-700 hover:underline"
          :href="detail.website"
          target="_blank"
          rel="noreferrer"
        >
          {{ detail.website }}
        </a>

        <div class="h-4"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  query: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  results: { type: Array, default: () => [] },
  activeId: { type: String, default: null },
  detail: { type: Object, default: null },
})

defineEmits(['updateQuery', 'search', 'select', 'addDetail'])
</script>
