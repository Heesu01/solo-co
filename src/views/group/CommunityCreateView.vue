<template>
  <div class="min-h-screen bg-slate-50">
    <div class="w-full px-3 pt-28 pb-10 md:px-6">
      <div class="mx-auto max-w-[1400px]">
        <div class="grid gap-6 items-start" style="grid-template-columns: 360px 1fr">
          <GroupSidebar @manage-member="onManageMember" />

          <main class="min-w-0">
            <section class="overflow-hidden bg-white border border-slate-200">
              <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div class="min-w-0">
                  <p class="text-[11px] font-semibold tracking-[0.18em] text-slate-400">
                    COMMUNITY POST
                  </p>
                  <h2 class="mt-1 text-[16px] font-semibold text-slate-900">글 작성</h2>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="cursor-pointer px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200"
                    @click="goBack"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    class="cursor-pointer px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900"
                    :disabled="!canSubmit"
                    @click="onSubmit"
                  >
                    등록
                  </button>
                </div>
              </div>

              <div class="px-6 py-6">
                <div>
                  <div class="flex items-end justify-between">
                    <label class="text-[12px] font-semibold text-slate-900">제목</label>
                    <p class="text-[11px] text-slate-400">{{ titleCount }}/60</p>
                  </div>

                  <input
                    v-model="form.title"
                    maxlength="60"
                    type="text"
                    placeholder="예) 도쿄 라멘 맛집 추천"
                    class="mt-2 w-full border-b border-slate-200 px-0 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div class="my-6 h-px bg-slate-200"></div>

                <!-- 내용 -->
                <div>
                  <div class="flex items-end justify-between">
                    <label class="text-[12px] font-semibold text-slate-900">내용</label>
                    <p class="text-[11px] text-slate-400">{{ contentCount }}/1000</p>
                  </div>

                  <textarea
                    v-model="form.content"
                    rows="10"
                    maxlength="1000"
                    placeholder="후기, 팁, 일정에 넣을만한 정보를 적어주세요."
                    class="mt-2 w-full border border-slate-200 px-3 py-3 text-sm leading-relaxed outline-none focus:border-slate-400"
                  />
                </div>

                <div class="my-6 h-px bg-slate-200"></div>

                <div class="grid gap-6 lg:grid-cols-2">
                  <div>
                    <div class="flex items-end justify-between">
                      <label class="text-[12px] font-semibold text-slate-900">태그</label>
                      <p class="text-[11px] text-slate-400">{{ form.tags.length }}/8</p>
                    </div>

                    <div class="mt-2 flex flex-wrap gap-1.5">
                      <button
                        v-for="(t, idx) in form.tags"
                        :key="t + idx"
                        type="button"
                        class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
                        @click="removeTag(idx)"
                        title="삭제"
                      >
                        #{{ t }} <span class="text-slate-400">×</span>
                      </button>

                      <span v-if="form.tags.length === 0" class="text-[12px] text-slate-400">
                        태그를 추가하면 글이 더 잘 찾아져요
                      </span>
                    </div>

                    <div class="mt-3 flex items-center gap-2">
                      <input
                        v-model="tagInput"
                        type="text"
                        placeholder="엔터로 추가"
                        class="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                        @keyup.enter.exact.prevent="addTag"
                        @keydown.enter.prevent
                      />

                      <button
                        type="button"
                        class="shrink-0 border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        @click="addTag"
                      >
                        추가
                      </button>
                    </div>

                    <p v-if="tagError" class="mt-2 text-[12px] font-medium text-rose-600">
                      {{ tagError }}
                    </p>
                  </div>

                  <div>
                    <div class="flex items-end justify-between">
                      <label class="text-[12px] font-semibold text-slate-900">사진</label>
                      <p class="text-[11px] text-slate-400">선택</p>
                    </div>

                    <input
                      ref="fileInputRef"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="onPickImage"
                    />

                    <div v-if="!imagePreview" class="mt-2">
                      <button
                        type="button"
                        class="w-full border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        @click="openFilePicker"
                      >
                        사진 선택
                      </button>
                      <p class="mt-2 text-[12px] text-slate-400">
                        목록에서 미리보기로 보여줄 사진을 추가할 수 있어요.
                      </p>
                    </div>

                    <div v-else class="mt-2 overflow-hidden border border-slate-200">
                      <div class="relative aspect-[16/10] bg-slate-100">
                        <img :src="imagePreview" alt="preview" class="h-full w-full object-cover" />
                      </div>

                      <div class="flex items-center justify-between px-3 py-2">
                        <div class="min-w-0">
                          <p class="truncate text-[12px] font-semibold text-slate-800">
                            {{ imageFile?.name }}
                          </p>
                          <p class="text-[11px] text-slate-400">
                            {{ prettyFileSize(imageFile?.size) }}
                          </p>
                        </div>

                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            class="border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                            @click="openFilePicker"
                          >
                            변경
                          </button>
                          <button
                            type="button"
                            class="border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                            @click="removeImage"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="my-6 h-px bg-slate-200"></div>

                <div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-[12px] font-semibold text-slate-900">투표</p>
                      <p class="mt-1 text-[12px] text-slate-500">필요한 경우에만 추가</p>
                    </div>

                    <label
                      class="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-700"
                    >
                      <input type="checkbox" v-model="voteEnabled" class="h-4 w-4" />
                      투표 추가
                    </label>
                  </div>

                  <div v-if="voteEnabled" class="mt-4 grid gap-4">
                    <div>
                      <label class="text-[12px] font-semibold text-slate-900">질문</label>
                      <input
                        v-model="form.vote.question"
                        type="text"
                        placeholder="예) 어디가 더 좋아?"
                        class="mt-2 w-full border-b border-slate-200 px-0 py-2.5 text-sm outline-none focus:border-slate-400"
                      />
                    </div>

                    <div
                      class="flex items-center justify-between border border-slate-200 px-3 py-2.5"
                    >
                      <p class="text-[12px] text-slate-700">복수 선택</p>
                      <label
                        class="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-700"
                      >
                        <input type="checkbox" v-model="form.vote.multipleChoice" class="h-4 w-4" />
                        허용
                      </label>
                    </div>

                    <div>
                      <div class="flex items-center justify-between">
                        <label class="text-[12px] font-semibold text-slate-900">선택지</label>
                        <button
                          type="button"
                          class="border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                          @click="addOption"
                        >
                          + 추가
                        </button>
                      </div>

                      <div class="mt-2 space-y-2">
                        <div
                          v-for="(opt, idx) in form.vote.options"
                          :key="idx"
                          class="flex items-center gap-2"
                        >
                          <input
                            v-model="form.vote.options[idx]"
                            type="text"
                            :placeholder="`선택지 ${idx + 1}`"
                            class="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                          />
                          <button
                            type="button"
                            class="border border-slate-200 bg-white px-3 py-2.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                            @click="removeOption(idx)"
                            :disabled="form.vote.options.length <= 2"
                            title="최소 2개"
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      <p v-if="voteError" class="mt-2 text-[12px] font-medium text-rose-600">
                        {{ voteError }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="cursor-pointer sticky bottom-0 mt-2 border-t border-slate-200 bg-white/95 backdrop-blur"
              >
                <div class="flex items-center justify-end gap-2 px-6 py-3">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200"
                    @click="goBack"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    class="cursor-pointer px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900"
                    :disabled="!canSubmit"
                    @click="onSubmit"
                  >
                    등록
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import GroupSidebar from '@/components/group/GroupSidebar.vue'

const router = useRouter()

const voteEnabled = ref(false)
const tagInput = ref('')
const tagError = ref('')
const voteError = ref('')

const form = reactive({
  title: '',
  content: '',
  tags: [],
  vote: {
    question: '',
    multipleChoice: false,
    options: ['', ''],
  },
})

const titleCount = computed(() => form.title?.length ?? 0)
const contentCount = computed(() => form.content?.length ?? 0)

const fileInputRef = ref(null)
const imageFile = ref(null)
const imagePreview = ref('')

const openFilePicker = () => fileInputRef.value?.click()

const onPickImage = (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('이미지는 5MB 이하만 가능해요.')
    e.target.value = ''
    return
  }

  imageFile.value = file
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
  imagePreview.value = URL.createObjectURL(file)
}

const removeImage = () => {
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
  imagePreview.value = ''
  imageFile.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

onBeforeUnmount(() => {
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
})

watch(voteEnabled, (on) => {
  voteError.value = ''
  if (!on) {
    form.vote.question = ''
    form.vote.multipleChoice = false
    form.vote.options = ['', '']
  }
})

const tagAdding = ref(false)

const addTag = (e) => {
  if (e?.isComposing) return

  if (tagAdding.value) return
  tagAdding.value = true
  queueMicrotask(() => (tagAdding.value = false))

  tagError.value = ''
  const raw = tagInput.value.trim()
  if (!raw) return

  const cleaned = raw.replace(/^#/, '').trim()
  if (!cleaned) return

  if (form.tags.length >= 8) {
    tagError.value = '태그는 최대 8개까지 가능해요.'
    return
  }

  const normalized = cleaned.toLowerCase()
  const existed = form.tags.some((t) => t.toLowerCase() === normalized)
  if (!existed) form.tags.push(cleaned)

  tagInput.value = ''
}

const removeTag = (idx) => form.tags.splice(idx, 1)

const addOption = () => form.vote.options.push('')
const removeOption = (idx) => {
  if (form.vote.options.length <= 2) return
  form.vote.options.splice(idx, 1)
}

const canSubmit = computed(() => {
  voteError.value = ''
  if (!form.title.trim()) return false
  if (!form.content.trim()) return false

  if (!voteEnabled.value) return true

  if (!form.vote.question.trim()) return false
  const opts = form.vote.options.map((v) => v.trim()).filter(Boolean)
  return opts.length >= 2
})

const buildPayload = () => {
  const base = {
    title: form.title.trim(),
    content: form.content.trim(),
    tags: form.tags,
  }

  if (!voteEnabled.value) return base

  return {
    ...base,
    vote: {
      question: form.vote.question.trim(),
      multipleChoice: !!form.vote.multipleChoice,
      options: form.vote.options.map((v) => v.trim()).filter(Boolean),
    },
  }
}

const onSubmit = () => {
  if (voteEnabled.value) {
    const opts = form.vote.options.map((v) => v.trim()).filter(Boolean)
    if (opts.length < 2) {
      voteError.value = '선택지는 최소 2개 필요해요.'
      return
    }
  }

  const payload = buildPayload()
  console.log('submit payload:', payload)
  console.log('imageFile:', imageFile.value)

  router.back()
}

const goBack = () => router.back()

const onManageMember = (m) => alert(`${m.name} 멤버 관리`)

const prettyFileSize = (bytes = 0) => {
  if (!bytes) return '-'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)}KB`
  return `${(kb / 1024).toFixed(1)}MB`
}
</script>
