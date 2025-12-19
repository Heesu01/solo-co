<template>
  <div class="min-h-screen bg-slate-50">
    <div class="w-full px-3 pt-20 pb-10 md:px-6 pt-30">
      <div class="mx-auto max-w-[1400px]">
        <div class="grid gap-6 items-start" style="grid-template-columns: 360px 1fr">
          <GroupSidebar />

          <main class="min-w-0">
            <section class="border border-slate-200 bg-white">
              <div class="border-b border-slate-200">
                <div class="flex items-center justify-between gap-4 px-5 py-4">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 text-[11px] text-slate-500">
                      <button
                        type="button"
                        class="cursor-pointer inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-slate-400 hover:text-slate-700"
                        @click="goBack"
                      >
                        <span>COMMUNITY</span>
                      </button>
                    </div>

                    <h2 class="mt-1.5 truncate text-[18px] font-semibold text-slate-900">
                      {{ post?.title || '게시글' }}
                    </h2>
                  </div>

                  <div class="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      class="cursor-pointer border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      @click="goBack"
                    >
                      글 목록
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="loading" class="p-10 text-center text-slate-500">불러오는 중...</div>
              <div v-else-if="errorMsg" class="p-10 text-center text-rose-600">
                {{ errorMsg }}
              </div>

              <div v-else class="p-6">
                <div v-if="!post" class="py-16 text-center text-slate-500">
                  게시글을 찾지 못했어요.
                </div>

                <div v-else class="space-y-6">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                      <div
                        class="h-9 w-9 overflow-hidden rounded-full bg-white ring-1 ring-slate-200"
                      >
                        <img
                          v-if="post.authorProfileImage"
                          :src="post.authorProfileImage"
                          alt=""
                          class="h-full w-full object-cover"
                        />
                        <div
                          v-else
                          class="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500"
                        >
                          {{ initials(post.authorName) }}
                        </div>
                      </div>

                      <div class="min-w-0">
                        <p class="truncate text-[13px] font-semibold text-slate-900">
                          {{ post.authorName || '작성자' }}
                        </p>
                        <p class="text-[11px] text-slate-500">
                          {{ post.createdAt || '' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="p-4 text-[13px] leading-relaxed text-slate-700">
                    <p class="whitespace-pre-wrap">{{ post.content || '' }}</p>
                  </div>

                  <div v-if="post.images?.length" class="space-y-2">
                    <div class="overflow-hidden border border-slate-200 bg-slate-100">
                      <div class="relative aspect-[16/10]">
                        <img
                          :src="post.images[activeImageIndex]"
                          alt=""
                          class="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    <div v-if="post.images.length > 1" class="flex gap-2 overflow-x-auto pb-1">
                      <button
                        v-for="(img, idx) in post.images"
                        :key="img + idx"
                        type="button"
                        class="h-14 w-20 shrink-0 overflow-hidden border ring-1"
                        :class="
                          idx === activeImageIndex
                            ? 'border-slate-900 ring-slate-900'
                            : 'border-slate-200 ring-slate-200 hover:border-slate-400'
                        "
                        @click="activeImageIndex = idx"
                      >
                        <img :src="img" alt="" class="h-full w-full object-cover" />
                      </button>
                    </div>
                  </div>

                  <div v-if="post.vote" class="border border-slate-200 p-4">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-[12px] font-semibold text-slate-900">투표</p>
                        <p class="mt-1 text-[13px] font-semibold text-slate-800">
                          {{ post.vote.question }}
                        </p>
                        <p class="mt-1 text-[11px] text-slate-500">
                          총 {{ post.vote.totalVotes }}표
                        </p>
                      </div>

                      <span
                        v-if="post.vote.hasVoted"
                        class="shrink-0 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600"
                      >
                        참여 완료
                      </span>
                    </div>

                    <div class="mt-4 space-y-2">
                      <button
                        v-for="opt in post.vote.options"
                        :key="opt.optionId"
                        type="button"
                        class="w-full border border-slate-200 px-3 py-2 text-left text-[12px] hover:bg-slate-50"
                        :class="post.vote.hasVoted ? 'cursor-default' : 'cursor-pointer'"
                        @click="onPickVote(opt.optionId)"
                      >
                        <div class="flex items-center justify-between gap-3">
                          <span class="min-w-0 truncate text-slate-800">{{ opt.text }}</span>
                          <span class="text-[11px] text-slate-500">{{ opt.count }}</span>
                        </div>

                        <div v-if="post.vote.hasVoted" class="mt-2 h-1 w-full bg-slate-100">
                          <div
                            class="h-1 bg-slate-900"
                            :style="{ width: votePercent(opt.count) + '%' }"
                          ></div>
                        </div>
                      </button>
                    </div>

                    <p v-if="voteUiError" class="mt-2 text-[12px] font-medium text-rose-600">
                      {{ voteUiError }}
                    </p>
                  </div>

                  <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5">
                    <span
                      v-for="t in post.tags"
                      :key="t"
                      class="bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
                    >
                      #{{ t }}
                    </span>
                  </div>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GroupSidebar from '@/components/group/GroupSidebar.vue'
import { fetchTravelPostDetail } from '@/api/group'

const router = useRouter()
const route = useRoute()

const projectId = computed(() => Number(route.params.id))
const postId = computed(() => Number(route.params.postId))

const loading = ref(false)
const errorMsg = ref('')
const post = ref(null)

const activeImageIndex = ref(0)

const voteUiError = ref('')
const pickedOptionId = ref(null)

const initials = (name = '') => name.trim().slice(0, 1) || '?'

const isValidIds = computed(() => {
  return (
    Number.isFinite(projectId.value) &&
    projectId.value > 0 &&
    Number.isFinite(postId.value) &&
    postId.value > 0
  )
})

const normalizeDetail = (d) => {
  activeImageIndex.value = 0
  return {
    postId: d.postId,
    title: d.title,
    content: d.content,
    authorId: d.userId,
    authorName: d.userName,
    authorProfileImage: d.userProfileImage,
    createdAt: d.createdAt,
    tags: d.tags || [],
    images: Array.isArray(d.images) ? d.images : [],
    vote: d.vote
      ? {
          voteId: d.vote.voteId,
          question: d.vote.question,
          options: Array.isArray(d.vote.options) ? d.vote.options : [],
          totalVotes: d.vote.totalVotes ?? 0,
          hasVoted: !!d.vote.hasVoted,
        }
      : null,
    comments: Array.isArray(d.comments) ? d.comments : [],
  }
}

const loadPost = async () => {
  if (!isValidIds.value) {
    post.value = null
    errorMsg.value = '잘못된 접근이에요.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const res = await fetchTravelPostDetail({
      projectId: projectId.value,
      postId: postId.value,
    })

    const data = res?.data ?? null
    if (!data) {
      post.value = null
      errorMsg.value = '게시글을 찾지 못했어요.'
      return
    }

    post.value = normalizeDetail(data)
  } catch (e) {
    console.error('[CommunityDetail] fetch error:', e)
    errorMsg.value = '게시글을 불러오지 못했어요.'
    post.value = null
  } finally {
    loading.value = false
  }
}

onMounted(loadPost)

watch([projectId, postId], loadPost)

const goBack = () => router.back()

const votePercent = (count) => {
  const total = post.value?.vote?.totalVotes ?? 0
  if (!total) return 0
  return Math.round((count / total) * 100)
}

const onPickVote = () => {
  //
}

// const copyLink = async () => {
//   try {
//     await navigator.clipboard.writeText(window.location.href)
//     alert('링크를 복사했어요.')
//   } catch (e) {
//     alert('복사에 실패했어요.')
//   }
// }
</script>
