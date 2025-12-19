<template>
  <div class="mt-6 border-t border-slate-200 pt-6">
    <div class="flex items-center justify-between">
      <p class="text-sm font-semibold text-slate-900">댓글</p>
      <p class="text-[11px] text-slate-500">{{ commentsCount }}개</p>
    </div>

    <div class="mt-3 rounded-lg border border-slate-200 bg-white p-3">
      <textarea
        v-model="draft"
        rows="2"
        placeholder="댓글을 입력하세요"
        class="w-full resize-none text-sm text-slate-800 outline-none placeholder:text-slate-400"
        @keydown.enter.exact.prevent="submit"
      />
      <div class="mt-2 flex items-center justify-between">
        <p v-if="uiError" class="text-[12px] font-medium text-rose-600">
          {{ uiError }}
        </p>
        <div class="ml-auto flex items-center gap-2">
          <button
            type="button"
            class="cursor-pointer rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="submitting || !canSubmit"
            @click="submit"
          >
            {{ submitting ? '등록 중...' : '등록' }}
          </button>
        </div>
      </div>
    </div>

    <div class="mt-4 space-y-3">
      <div v-if="!safeComments.length" class="rounded-lg p-4">
        <p class="text-sm text-slate-500">아직 댓글이 없어요. 첫 댓글을 남겨보세요.</p>
      </div>

      <div
        v-for="c in safeComments"
        :key="c.commentId"
        class="bg-white p-4 border-b border-slate-200"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex min-w-0 items-start gap-3">
            <div
              class="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-slate-200"
            >
              <img
                v-if="c.userProfileImage"
                :src="c.userProfileImage"
                alt=""
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center text-[11px] font-semibold text-slate-500"
              >
                {{ initials(c.userName) }}
              </div>
            </div>

            <div class="min-w-0">
              <p class="truncate text-[13px] font-semibold text-slate-900">
                {{ c.userName || '익명' }}
              </p>
              <p class="mt-0.5 text-[11px] text-slate-500">
                {{ c.createdAt || '' }}
              </p>
            </div>
          </div>

          <button
            v-if="c.canDelete"
            type="button"
            class="cursor-pointer text-[11px] font-medium text-slate-400 hover:text-rose-600 underline-offset-2 hover:underline"
            @click="requestDelete(c.commentId)"
          >
            삭제
          </button>
        </div>

        <p class="mt-3 ml-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {{ c.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
  submitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'delete'])

const draft = ref('')
const uiError = ref('')

const safeComments = computed(() => (Array.isArray(props.comments) ? props.comments : []))
const commentsCount = computed(() => safeComments.value.length)

const canSubmit = computed(() => draft.value.trim().length > 0)

const initials = (name = '') => {
  const t = (name ?? '').toString().trim()
  return t.slice(0, 1) || '?'
}

watch(
  () => props.submitting,
  (v) => {
    if (!v) uiError.value = ''
  },
)

const submit = async () => {
  uiError.value = ''

  const content = draft.value.trim()
  if (!content) {
    uiError.value = '댓글 내용을 입력해주세요.'
    return
  }

  try {
    await emit('submit', { content })
    draft.value = ''
  } catch (e) {
    uiError.value = '댓글 작성에 실패했어요.'
  }
}

const requestDelete = async (commentId) => {
  if (!commentId) return
  if (!confirm('댓글을 삭제할까요?')) return

  try {
    await emit('delete', { commentId })
  } catch (e) {
    //
  }
}
</script>
