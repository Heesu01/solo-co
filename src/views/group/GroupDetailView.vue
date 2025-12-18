<template>
  <div class="min-h-screen bg-slate-50">
    <div class="w-full px-3 pt-20 pb-10 md:px-6 pt-30">
      <div class="mx-auto max-w-[1400px]">
        <div class="grid gap-6 items-start" style="grid-template-columns: 360px 1fr">
          <GroupSidebar :group="group" :members="members" @manage-member="onManageMember" />

          <main class="min-w-0">
            <section class="border border-slate-200 bg-white">
              <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <div>
                  <h2 class="text-sm font-semibold text-slate-900">커뮤니티</h2>
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
                    class="bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                    @click="goCreatePost"
                  >
                    글 작성
                  </button>
                </div>
              </div>

              <div>
                <div v-if="filteredPosts.length === 0" class="p-12 text-center text-slate-500">
                  <p class="text-sm font-semibold text-slate-800">게시글이 없어요</p>
                  <p class="mt-1 text-[12px]">첫 글을 작성해보세요.</p>
                </div>

                <ul v-else class="divide-y divide-slate-200">
                  <li
                    v-for="p in filteredPosts"
                    :key="p.id"
                    class="group flex items-start gap-4 px-4 py-4 cursor-pointer hover:bg-slate-50"
                    @click="goPostDetail(p.id)"
                  >
                    <div class="min-w-0 flex-1">
                      <h3
                        class="truncate text-[14px] font-semibold text-slate-900 group-hover:underline"
                      >
                        {{ p.title }}
                      </h3>

                      <div class="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                        <span class="font-medium text-slate-700">{{ p.author }}</span>
                        <span>·</span>
                        <span>{{ p.date }}</span>
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
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import GroupSidebar from '@/components/group/GroupSidebar.vue'

const router = useRouter()
const route = useRoute()

const group = ref({
  id: route.params?.id || 1,
  title: '2월 도쿄 졸업여행',
  location: '도쿄',
  startDate: '2025-02-10',
  endDate: '2025-02-12',
  status: 'IN_PROGRESS',
  thumbnail:
    'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1200&auto=format&fit=crop',
})

const members = ref([
  { id: 1, name: '희수', email: 'heesu@example.com', role: 'OWNER', avatar: '' },
  { id: 2, name: '태정', email: 'jiseon@example.com', role: 'MEMBER', avatar: '' },
  { id: 3, name: '지선', email: 'seoyoung@example.com', role: 'MEMBER', avatar: '' },
])

const posts = ref([
  {
    id: 101,
    author: '희수',
    date: '2025-01-03',
    title: '도쿄 가면 꼭 먹어야 하는 라멘 3곳',
    image:
      'https://images.unsplash.com/photo-1526481280695-3c687fd5432c?q=80&w=1200&auto=format&fit=crop',
    content:
      '이치란도 좋지만… 이번에는 현지인 추천 위주로 3군데만 딱 정리해봤어! 위치/대기시간/가격대까지 같이 적어둘게.',
    tags: ['라멘', '맛집', '추천'],
  },
  {
    id: 102,
    author: '지선',
    date: '2025-01-04',
    title: '디즈니 vs 해리포터 스튜디오, 하루에 가능?',
    image:
      'https://images.unsplash.com/photo-1526481280695-3c687fd5432c?q=80&w=1200&auto=format&fit=crop',
    content: '둘 다 욕심나는데 무리일까? 이동시간이랑 입장시간 계산해보면… 의견 부탁!',
    tags: ['테마파크', '일정', '토론'],
  },
  {
    id: 103,
    author: '희수',
    date: '2025-01-05',
    title: '공항에서 숙소까지 교통 정리 (나리타/하네다)',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1200&auto=format&fit=crop',
    content:
      '스카이라이너/리무진/전철 비교해서 표로 정리해봤어. 도착시간대에 따라 추천도 달아놨어.',
    tags: ['교통', '공항', '정리'],
  },
])

const postQuery = ref('')

const filteredPosts = computed(() => {
  const q = postQuery.value.trim().toLowerCase()
  if (!q) return posts.value
  return posts.value.filter((p) => {
    const hay = `${p.title} ${p.author} ${p.content} ${p.tags.join(' ')}`.toLowerCase()
    return hay.includes(q)
  })
})

const goCreatePost = () => {
  router.push(`/group/${group.value.id}/create`)
}

const goPostDetail = (postId) => {
  router.push(`/group/${group.value.id}/community/${postId}`)
}

const onManageMember = (m) => alert(`${m.name} 멤버 관리 UI를 여기서 열면 돼요.`)

const initials = (name = '') => name.trim().slice(0, 1) || '?'

const statusLabel = (s) => {
  if (s === 'UPCOMING') return '예정'
  if (s === 'IN_PROGRESS') return '진행중'
  if (s === 'DONE') return '완료'
  return '상태'
}

const statusChipClass = (s) => {
  if (s === 'IN_PROGRESS') return 'bg-emerald-50 text-emerald-700'
  if (s === 'DONE') return 'bg-slate-100 text-slate-600'
  return 'bg-sky-50 text-sky-700'
}
</script>
