<template>
  <div class="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div class="animate-pop flex items-center gap-4 rounded-2xl px-6 py-4">
      <div class="relative h-6 w-6">
        <span class="absolute inset-0 rounded-full border-2 border-slate-200" />
        <span
          class="absolute inset-0 rounded-full border-2 border-slate-700 border-t-transparent animate-spin"
        />
      </div>

      <p class="text-[13px] font-semibold text-white">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '로딩중…',
  },
})
</script>

<style scoped>
@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-pop {
  animation: pop 160ms ease-out;
}
</style>
