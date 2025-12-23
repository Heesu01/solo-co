<template>
  <div class="min-h-screen bg-slate-50">
    <div class="w-full px-3 pt-20 pb-10 md:px-6 pt-30">
      <div class="mx-auto max-w-[1400px]">
        <div class="grid gap-6 items-start" style="grid-template-columns: 360px 1fr">
          <GroupSidebar @manage-member="onManageMember" />

          <main class="min-w-0">
            <section class="border border-slate-200 bg-white">
              <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <div>
                  <span class="tracking-[0.18em] font-semibold">COMMUNITY</span>
                  <p class="mt-0.5 text-[12px] text-slate-500">게시글로 사진·정보를 공유해요.</p>
                </div>

                <div class="flex items-center gap-2">
                  <div class="flex items-center border border-slate-200 px-3 py-2">
                    <input
                      v-model="postQuery"
                      placeholder="검색"
                      class="w-56 md:w-72 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    class="cursor-pointer bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                    @click="goCreatePost"
                  >
                    글 작성
                  </button>
                </div>
              </div>

              <div v-if="loading" class="p-12 text-center text-slate-500">불러오는 중...</div>
              <div v-else-if="errorMsg" class="p-12 text-center text-rose-600">
                {{ errorMsg }}
              </div>

              <div v-else>
                <div v-if="filteredPosts.length === 0" class="p-12 text-center text-slate-500">
                  <p class="text-sm font-semibold text-slate-800">게시글이 없어요</p>
                  <p class="mt-1 text-[12px]">첫 글을 작성해보세요.</p>
                </div>

                <ul v-else class="divide-y divide-slate-200">
                  <li
                    v-for="p in filteredPosts"
                    :key="p.postId"
                    class="group flex items-start gap-4 px-4 py-4 cursor-pointer hover:bg-slate-50"
                    @click="goPostDetail(p.postId)"
                  >
                    <div class="min-w-0 flex-1">
                      <h3
                        class="truncate text-[14px] font-semibold text-slate-900 group-hover:underline"
                      >
                        {{ p.title }}
                      </h3>

                      <div class="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                        <span class="font-medium text-slate-700">{{ p.author }}</span>
                        <!-- <span>·</span> -->
                        <!-- <span>{{ p.date }}</span> -->
                      </div>

                      <p class="mt-2 line-clamp-2 text-[12px] leading-relaxed text-slate-600">
                        {{ p.content }}
                      </p>

                      <div class="mt-2 flex flex-wrap gap-1.5">
                        <span
                          v-for="t in p.tags"
                          :key="t"
                          class="bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600"
                        >
                          #{{ t }}
                        </span>
                      </div>
                    </div>

                    <div
                      v-if="p.image"
                      class="h-20 w-28 shrink-0 overflow-hidden bg-slate-100 ring-1 ring-slate-200"
                    >
                      <img
                        :src="p.image"
                        alt=""
                        class="h-full w-full object-cover transition group-hover:scale-[1.02]"
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import GroupSidebar from '@/components/group/GroupSidebar.vue'
import { fetchTravelPosts } from '@/api/project'

const router = useRouter()
const route = useRoute()

const projectId = computed(() => Number(route.params.id))

const postQuery = ref('')
const posts = ref([])
const loading = ref(false)
const errorMsg = ref('')

const normalizeListItem = (p) => ({
  postId: p.postId,
  title: p.title,
  content: p.contentPreview,
  author: p.authorName,
  authorProfileImage: p.authorProfileImage,
  tags: p.tags || [],
  image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '',
})

const loadPosts = async () => {
  if (!projectId.value) return
  loading.value = true
  errorMsg.value = ''

  try {
    const res = await fetchTravelPosts({
      projectId: projectId.value,
      query: postQuery.value.trim(),
    })

    const list = Array.isArray(res?.data) ? res.data : []
    posts.value = list
  } catch (e) {
    console.error('[CommunityList] fetch error:', e)
    errorMsg.value = '게시글 목록을 불러오지 못했어요.'
    posts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadPosts)

let t = null
watch(postQuery, () => {
  if (t) clearTimeout(t)
  t = setTimeout(() => loadPosts(), 250)
})
onBeforeUnmount(() => {
  if (t) clearTimeout(t)
})

const filteredPosts = computed(() => posts.value.map(normalizeListItem))

const goCreatePost = () => {
  router.push(`/group/${route.params.id}/create`)
}

const goPostDetail = (postId) => {
  router.push(`/group/${route.params.id}/community/${postId}`)
}

const onManageMember = (m) => alert(`${m.name} 멤버 관리 UI를 여기서 열면 돼요.`)
</script>
