<template>
  <article
    class="group relative rounded-3xl border bg-white/95 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    :class="trip.status === 'DONE' ? 'border-slate-200 bg-slate-50/80' : 'border-slate-100'"
  >
    <button
      class="cursor-pointer absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs hover:bg-white"
      @click.stop="toggleMenu"
    >
      ⋯
    </button>

    <div
      v-if="showMenu"
      class="absolute right-3 top-10 z-20 w-32 overflow-hidden rounded-xl border-gray-200 bg-white shadow-lg"
    >
      <button
        class="cursor-pointer block w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
        @click="openEditModal"
      >
        수정하기
      </button>

      <button
        v-if="trip.projectType === 'GROUP'"
        class="cursor-pointer block w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
        @click="openShareModal"
      >
        공유하기
      </button>

      <button
        class="cursor-pointer block w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
        @click="emitDelete"
      >
        삭제하기
      </button>
    </div>

    <header class="mb-3">
      <h3 class="text-[15px] font-semibold text-slate-900">
        {{ trip.title }}
      </h3>

      <div class="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
        <span class="inline-flex items-center gap-1">
          <MapPinIcon class="h-3.5 w-3.5" />
          {{ trip.location }}
        </span>

        <span class="inline-flex items-center gap-1">
          <CalendarIcon class="h-3.5 w-3.5" />
          {{ trip.dateLabel }}
        </span>

        <span class="inline-flex items-center gap-1">
          <UsersIcon class="h-3.5 w-3.5" />
          {{ trip.members }}명
        </span>
      </div>
    </header>

    <div class="mb-4">
      <div class="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100">
        <img
          :src="trip.thumbnail"
          :alt="`${trip.title} 썸네일`"
          class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
    </div>

    <div class="flex items-center justify-between">
      <button
        v-if="trip.status !== 'DONE'"
        type="button"
        class="cursor-pointer h-9 flex-1 rounded-xl bg-slate-900 text-[12px] font-semibold text-slate-50 shadow-sm transition hover:bg-slate-800"
        @click="emitEnter"
      >
        입장하기
      </button>

      <div
        v-else
        class="flex h-9 w-full items-center justify-between rounded-xl bg-gray-600 px-3 text-[11px] font-medium text-slate-50"
      >
        <span>완료된 여행</span>
      </div>
    </div>

    <teleport to="body">
      <div
        v-if="showEditModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @click.self="closeModals"
      >
        <div
          class="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto"
        >
          <header class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-base font-semibold text-slate-900">여행 정보 수정</h2>
              <p class="mt-1 text-[11px] text-slate-500">
                제목, 여행지, 날짜, 표지 이미지를 간단히 수정할 수 있어요.
              </p>
            </div>
            <span
              class="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-600"
            >
              {{ trip.projectType === 'GROUP' ? '그룹 여행' : '개인 여행' }}
            </span>
          </header>

          <form class="space-y-5" @submit.prevent="handleEditSubmit">
            <section class="flex items-center gap-4">
              <div class="h-20 w-28 overflow-hidden rounded-2xl bg-slate-100 shrink-0">
                <img
                  v-if="editThumbnailPreview"
                  :src="editThumbnailPreview"
                  alt="수정용 썸네일 미리보기"
                  class="h-full w-full object-cover"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center text-[11px] text-slate-400"
                >
                  표지 없음
                </div>
              </div>

              <div class="flex flex-col gap-1 text-[11px] text-slate-500">
                <p class="font-medium text-slate-700">표지 이미지</p>
                <p>카드에 보이는 표지 이미지를 바꾸고 싶다면 아래 버튼을 눌러주세요.</p>
                <button
                  type="button"
                  class="cursor-pointer mt-1 self-start rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                  @click="triggerEditFileInput"
                >
                  이미지 변경
                </button>
                <p class="text-[10px] text-slate-400">JPG · PNG / 10MB 이하</p>
              </div>

              <input
                ref="editFileInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onEditThumbnailChange"
              />
            </section>

            <section class="space-y-3">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-600">프로젝트 이름</label>
                <input
                  v-model="editTitle"
                  type="text"
                  class="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-1 focus:ring-sky-100"
                  placeholder="예: 2월 도쿄 졸업여행"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-600">여행지</label>
                <input
                  v-model="editLocation"
                  type="text"
                  class="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-1 focus:ring-sky-100"
                  placeholder="예: 도쿄, 제주, 부산..."
                />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-slate-600">시작 날짜</label>
                  <input
                    v-model="editStartDate"
                    type="date"
                    class="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-slate-600">종료 날짜</label>
                  <input
                    v-model="editEndDate"
                    type="date"
                    class="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100"
                  />
                </div>
              </div>
            </section>

            <div class="mt-2 flex gap-2 pt-1">
              <button
                type="button"
                class="cursor-pointer h-9 flex-1 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 hover:bg-slate-100"
                @click="closeModals"
              >
                취소
              </button>
              <button
                type="submit"
                class="cursor-pointer h-9 flex-1 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-40"
                :disabled="!canSaveEdit"
              >
                변경 사항 저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <div
        v-if="showShareModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @click.self="closeModals"
      >
        <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
          <h2 class="mb-4 text-lg font-semibold text-slate-900">그룹 여행 초대 링크</h2>
          <p class="mb-3 text-[13px] text-slate-500">
            이 링크를 친구에게 보내면, 같이 일정을 보고 수정할 수 있어요.
          </p>

          <div
            class="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <span class="truncate text-[12px] text-slate-500">
              {{ shareUrl }}
            </span>
            <button
              type="button"
              class="cursor-pointer shrink-0 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-50 hover:bg-slate-800"
              @click="copyShareUrl"
            >
              복사
            </button>
          </div>

          <button
            class="cursor-pointer mt-6 w-full rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
            @click="closeModals"
          >
            닫기
          </button>
        </div>
      </div>
    </teleport>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MapPinIcon, CalendarIcon, UsersIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  trip: { type: Object, required: true },
})

const emit = defineEmits(['enter', 'delete', 'update', 'request-share'])

const showMenu = ref(false)
const showEditModal = ref(false)
const showShareModal = ref(false)

const editTitle = ref('')
const editLocation = ref('')
const editStartDate = ref('')
const editEndDate = ref('')
const editThumbnailPreview = ref('')
const editThumbnailFile = ref(null)
const editFileInputRef = ref(null)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const openEditModal = () => {
  editTitle.value = props.trip.title || ''
  editLocation.value = props.trip.location || ''
  editStartDate.value = props.trip.startDate || ''
  editEndDate.value = props.trip.endDate || ''
  editThumbnailPreview.value = props.trip.thumbnail || ''
  editThumbnailFile.value = null

  showEditModal.value = true
  showMenu.value = false
}

const openShareModal = () => {
  emit('request-share', props.trip.id)
  showShareModal.value = true
  showMenu.value = false
}

const closeModals = () => {
  showEditModal.value = false
  showShareModal.value = false
}

const emitEnter = () => emit('enter', props.trip)
const emitDelete = () => {
  emit('delete', props.trip.id)
  showMenu.value = false
}

const shareUrl = computed(() => {
  return props.trip.shareUrl || `${window.location.origin}/group/${props.trip.id}`
})

const copyShareUrl = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    alert('초대 링크가 복사되었습니다.')
  } catch (e) {
    console.error(e)
    alert('복사에 실패했어요. 직접 선택해서 복사해주세요.')
  }
}

const canSaveEdit = computed(() => {
  if (!editTitle.value.trim()) return false
  if (!editLocation.value.trim()) return false
  if (editStartDate.value && editEndDate.value && editStartDate.value > editEndDate.value)
    return false
  return true
})

const triggerEditFileInput = () => {
  editFileInputRef.value?.click()
}

const onEditThumbnailChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  editThumbnailFile.value = file
  editThumbnailPreview.value = URL.createObjectURL(file)
}

const handleEditSubmit = () => {
  if (!canSaveEdit.value) return

  emit('update', {
    id: props.trip.id,
    dto: {
      title: editTitle.value.trim(),
      location: editLocation.value.trim(),
      startDate: editStartDate.value || null,
      endDate: editEndDate.value || null,
      projectType: props.trip.projectType,
    },
    thumbnail: editThumbnailFile.value || null,
  })

  closeModals()
}
</script>
