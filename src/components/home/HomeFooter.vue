<template>
  <footer class="border-t border-slate-200 bg-white">
    <div
      class="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex items-center gap-3">
        <div class="grid h-7 w-7 place-items-center rounded-lg bg-slate-900 text-white">
          <span class="text-[11px] font-black">S</span>
        </div>
        <p class="text-[13px] font-semibold text-slate-900">Solo&Co</p>
        <span class="text-[12px] text-slate-400">© 2025</span>
      </div>

      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-slate-600">
        <button class="hover:text-slate-900" @click="openStub('이용약관')">이용약관</button>
        <button class="hover:text-slate-900" @click="openStub('개인정보처리방침')">
          개인정보처리방침
        </button>
        <a href="mailto:contact@soloco.app" class="hover:text-slate-900"> 문의 </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
const openStub = (name) => {
  alert(`${name} 페이지는 준비 중이에요.`)
}
</script>
