<template>
  <div class="min-h-screen bg-slate-50 mt-10">
    <div
      class="pointer-events-none fixed -left-20 top-10 h-40 w-40 rounded-full bg-sky-100/70 blur-3xl"
    ></div>
    <div
      class="pointer-events-none fixed -right-10 top-64 h-40 w-40 rounded-full bg-indigo-100/70 blur-3xl"
    ></div>

    <div class="relative mx-auto max-w-xl md:max-w-3xl px-4 pt-24 pb-24">
      <header class="mb-8">
        <p class="text-[11px] md:text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          group trip · solo&co
        </p>
        <h1 class="mt-2 text-2xl md:text-3xl font-semibold leading-snug text-slate-900">
          친구들과 떠날 여행,
          <br />
          정보를 조금씩 적어볼까요?
        </h1>
        <p class="mt-3 text-sm md:text-base text-slate-500">
          프로젝트 이름 → 여행지 → 날짜 순서로 차근차근 입력하면, 아래로 단계가 자동으로 열려요.
        </p>
      </header>

      <main class="grid gap-10 md:grid-cols-[1.05fr,1.1fr] md:items-start">
        <section class="space-y-2">
          <div class="flex items-center justify-between text-xs md:text-sm text-slate-500">
            <p class="font-medium text-slate-700">여행 카드 표지</p>
            <p class="text-slate-400">앨범에서 골라오면 커버처럼 예쁘게 보여드려요</p>
          </div>

          <button
            type="button"
            class="group relative w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-100/80 text-left shadow-sm transition hover:border-sky-200 hover:shadow-md"
            @click="triggerFileInput"
          >
            <div class="relative w-full">
              <div class="pt-[56%]"></div>

              <img
                v-if="thumbnailPreview"
                :src="thumbnailPreview"
                alt="여행 표지 미리보기"
                class="absolute inset-0 h-full w-full object-cover"
              />

              <div
                v-else
                class="cursor-pointer absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-indigo-100 to-violet-100"
              >
                <div
                  class="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-slate-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M4 7h3l1-2h8l1 2h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z"
                    />
                    <circle cx="12" cy="13" r="3.5" />
                  </svg>
                </div>
                <p class="text-sm md:text-base font-medium text-slate-800">
                  여행의 분위기를 담은 사진을 골라보세요
                </p>
                <p class="mt-1 text-xs md:text-[13px] text-slate-500">
                  단체 사진, 여행지 전경, 밈 이미지도 좋아요!
                </p>
              </div>

              <div
                v-if="thumbnailPreview"
                class="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/40 via-black/10 to-transparent px-4 pb-3 pt-8 text-xs md:text-[13px] text-white"
              >
                <div>
                  <p class="text-[10px] md:text-[11px] uppercase tracking-[0.16em] text-white/80">
                    cover preview
                  </p>
                  <p class="text-sm md:text-base font-semibold">
                    {{ title.trim() || '새 그룹 여행' }}
                  </p>
                  <p class="text-xs md:text-sm text-white/80">
                    {{ location.trim() || '여행지 미정' }}
                  </p>
                </div>
                <div
                  class="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[10px] md:text-xs font-medium text-white/90 backdrop-blur-sm"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  변경하려면 탭하기
                </div>
              </div>
            </div>
          </button>

          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleThumbnailChange"
          />
        </section>

        <section class="space-y-8 md:space-y-10">
          <form v-if="hasCover" class="space-y-8 md:space-y-10" @submit.prevent="handleSubmit">
            <div
              ref="step1Ref"
              class="space-y-3 rounded-2xl bg-white/90 px-4 py-5 shadow-sm ring-1 ring-slate-100"
            >
              <div class="flex items-start gap-3">
                <div
                  class="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-bg text-[11px] font-semibold text-primary"
                >
                  1
                </div>
                <div class="flex-1 space-y-1">
                  <p class="text-sm md:text-base font-medium text-slate-900">
                    프로젝트 이름이 뭐예요?
                  </p>
                  <p class="text-xs md:text-[13px] text-slate-400">
                    나중에 목록에서 봐도 바로 알아볼 수 있는 이름이면 좋아요.
                  </p>
                </div>
              </div>

              <div class="space-y-2 pt-3">
                <input
                  v-model="title"
                  type="text"
                  placeholder="예: 2월 도쿄 졸업여행, 여름 제주 바캉스"
                  class="w-full border-b border-slate-200 pb-2 text-sm md:text-base outline-none transition focus:border-sky-500"
                />
                <p v-if="submitAttempted && !hasTitle" class="text-[11px] text-rose-500">
                  프로젝트 이름을 입력해주세요.
                </p>
              </div>
            </div>

            <transition name="fade-slide">
              <div
                v-if="hasTitle"
                ref="step2Ref"
                class="space-y-3 rounded-2xl bg-white/90 px-4 py-5 shadow-sm ring-1 ring-slate-100"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent-bg text-[11px] font-semibold text-accent"
                  >
                    2
                  </div>
                  <div class="flex-1 space-y-1">
                    <p class="text-sm md:text-base font-medium text-slate-900">
                      어디로 떠날 예정인가요?
                    </p>
                    <p class="text-xs md:text-[13px] text-slate-400">
                      도시 이름만 적어도 괜찮아요. 복수 도시라면 메인으로 생각하는 곳을 적어 주세요.
                    </p>
                  </div>
                </div>

                <div class="space-y-2 pt-3">
                  <input
                    v-model="location"
                    type="text"
                    placeholder="예: 도쿄, 제주, 부산, 오사카..."
                    class="w-full border-b border-slate-200 pb-2 text-sm md:text-base outline-none transition focus:border-sky-500"
                  />
                  <p v-if="submitAttempted && !hasLocation" class="text-[11px] text-rose-500">
                    여행 장소를 입력해주세요.
                  </p>
                </div>
              </div>
            </transition>

            <transition name="fade-slide">
              <div
                v-if="hasTitle && hasLocation"
                ref="step3Ref"
                class="space-y-6 rounded-2xl bg-white/90 px-4 py-5 shadow-sm ring-1 ring-slate-100"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-pur-bg text-[11px] font-semibold text-pur"
                  >
                    3
                  </div>
                  <div class="flex-1 space-y-1">
                    <p class="text-sm md:text-base font-medium text-slate-900">
                      언제 떠날 예정인가요?
                    </p>
                    <p class="text-xs md:text-[13px] text-slate-400">
                      정확하지 않아도 괜찮아요. 대략적인 일정만 잡아도 충분해요.
                    </p>
                  </div>
                </div>

                <div class="mt-3 flex flex-col gap-3 text-sm md:text-base md:flex-row">
                  <div class="flex-1 space-y-1.5">
                    <p class="text-xs md:text-[13px] text-slate-500">시작 날짜</p>
                    <input
                      v-model="startDate"
                      type="date"
                      class="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
                    />
                  </div>
                  <div class="flex-1 space-y-1.5">
                    <p class="text-xs md:text-[13px] text-slate-500">종료 날짜</p>
                    <input
                      v-model="endDate"
                      type="date"
                      class="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
                    />
                  </div>
                </div>

                <div class="space-y-1 pt-1">
                  <p v-if="submitAttempted && !startDate" class="text-[11px] text-rose-500">
                    시작 날짜를 선택해주세요.
                  </p>
                  <p v-if="submitAttempted && !endDate" class="text-[11px] text-rose-500">
                    종료 날짜를 선택해주세요.
                  </p>
                  <p
                    v-if="submitAttempted && startDate && endDate && startDate > endDate"
                    class="text-[11px] text-rose-500"
                  >
                    종료 날짜는 시작 날짜 이후여야 합니다.
                  </p>
                </div>

                <div class="rounded-xl bg-slate-50 px-4 py-3 text-xs md:text-sm text-slate-600">
                  <p class="font-sub text-sub">입력 내용 요약</p>

                  <p class="mt-2 mb-1">
                    <span class="text-slate-400">프로젝트</span>
                    <span class="mx-1 text-slate-300">·</span>
                    <span class="font-medium text-slate-900">
                      {{ title.trim() || '이름 미정' }}
                    </span>
                  </p>
                  <p class="mb-1">
                    <span class="text-slate-400">여행지</span>
                    <span class="mx-1 text-slate-300">·</span>
                    <span class="font-medium text-slate-900">
                      {{ location.trim() || '여행지 미정' }}
                    </span>
                  </p>
                  <p>
                    <span class="text-slate-400">날짜</span>
                    <span class="mx-1 text-slate-300">·</span>
                    <span class="font-medium text-slate-900">
                      <template v-if="startDate && endDate">
                        {{ startDate }} ~ {{ endDate }}
                      </template>
                      <template v-else>날짜 미정</template>
                    </span>
                  </p>
                </div>

                <div class="pt-2">
                  <button
                    type="submit"
                    class="cursor-pointer flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-start to-end text-base font-semibold text-white shadow-sm transition hover:from-start-hover hover:to-end-hover disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="!canSubmit || isSubmitting"
                  >
                    {{ isSubmitting ? '생성 중...' : '계획 시작하기' }}
                  </button>
                </div>
              </div>
            </transition>
          </form>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createTravel } from '@/api/project'

const route = useRoute()
const router = useRouter()
const projectType = computed(() => (route.path.startsWith('/group') ? 'GROUP' : 'PERSONAL'))

const title = ref('')
const location = ref('')
const startDate = ref('')
const endDate = ref('')

const thumbnailPreview = ref('')
const thumbnailFile = ref(null)
const fileInputRef = ref(null)

const isSubmitting = ref(false)
const submitAttempted = ref(false)

const hasCover = computed(() => !!thumbnailPreview.value)
const hasTitle = computed(() => title.value.trim().length > 0)
const hasLocation = computed(() => location.value.trim().length > 0)

const step1Ref = ref(null)
const step2Ref = ref(null)
const step3Ref = ref(null)

const canSubmit = computed(() => {
  if (!hasTitle.value) return false
  if (!hasLocation.value) return false
  if (!startDate.value || !endDate.value) return false
  if (startDate.value > endDate.value) return false
  return true
})

const scrollToEl = (el) => {
  if (el && el.scrollIntoView) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleThumbnailChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  thumbnailFile.value = file
  thumbnailPreview.value = URL.createObjectURL(file)

  await nextTick()
  scrollToEl(step1Ref.value)
}

watch(hasTitle, async (newVal, oldVal) => {
  if (newVal && !oldVal) {
    await nextTick()
    scrollToEl(step2Ref.value)
  }
})

watch(hasLocation, async (newVal, oldVal) => {
  if (newVal && !oldVal) {
    await nextTick()
    scrollToEl(step3Ref.value)
  }
})

const handleSubmit = async () => {
  submitAttempted.value = true
  if (!canSubmit.value || isSubmitting.value) return

  isSubmitting.value = true

  try {
    const dto = {
      title: title.value.trim(),
      location: location.value.trim(),
      startDate: startDate.value,
      endDate: endDate.value,
      projectType: projectType.value,
    }

    const payload = {
      dto,
      thumbnailFile: thumbnailFile.value,
    }

    const res = await createTravel(payload)
    console.log(res.data)

    router.push('/group')
  } catch (err) {
    console.error(err)
    alert('여행 생성 중 문제가 발생했습니다.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.18s ease-out;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
