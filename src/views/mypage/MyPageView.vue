<template>
  <div class="min-h-screen bg-slate-50">
    <div class="w-full px-3 pt-30 pb-10 md:px-6">
      <div class="mx-auto max-w-[1400px] space-y-6">
        <section class="border border-slate-200 bg-white">
          <div class="border-b border-slate-200 px-6 py-4">
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              my page · solo&co
            </p>
            <h1 class="mt-1 text-[18px] font-semibold text-slate-900">마이페이지</h1>
          </div>

          <div class="p-6">
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div class="flex items-center gap-4">
                <div class="h-14 w-14 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
                  <img
                    v-if="me.profileImage"
                    :src="me.profileImage"
                    alt=""
                    class="h-full w-full object-cover"
                  />
                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500"
                  >
                    {{ initials(me.name) }}
                  </div>
                </div>

                <div class="min-w-0">
                  <p class="truncate text-[15px] font-semibold text-slate-900">{{ me.name }}</p>
                  <p class="mt-0.5 truncate text-[12px] text-slate-500">{{ me.email }}</p>
                  <p class="mt-1 text-[12px] text-slate-500">
                    가입일 <span class="text-slate-400">·</span> {{ me.createdAt }}
                    <span class="text-slate-400">·</span> {{ me.role }}
                  </p>
                </div>
              </div>

              <div class="flex gap-2 md:justify-end">
                <button
                  type="button"
                  class="cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="openEdit"
                >
                  정보 수정
                </button>
                <button
                  type="button"
                  class="cursor-pointer rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  @click="openWithdraw"
                >
                  탈퇴
                </button>
              </div>
            </div>

            <div class="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <InfoField label="이름" :value="me.name" />
              <InfoField label="이메일" :value="me.email" />
              <InfoField label="가입일" :value="me.createdAt" />
              <InfoField label="권한" :value="me.role" />
            </div>
          </div>
        </section>

        <section class="border border-slate-200 bg-white">
          <div class="border-b border-slate-200 px-6 py-4">
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              my projects
            </p>
            <div class="mt-1 flex items-end justify-between gap-4">
              <h2 class="text-[18px] font-semibold text-slate-900">내 프로젝트</h2>
              <p class="text-[12px] text-slate-500">{{ filteredProjects.length }}개</p>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold"
                  :class="
                    projectMode === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  "
                  @click="projectMode = 'ALL'"
                >
                  전체
                </button>
                <button
                  type="button"
                  class="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold"
                  :class="
                    projectMode === 'SOLO'
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  "
                  @click="projectMode = 'SOLO'"
                >
                  개인
                </button>
                <button
                  type="button"
                  class="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold"
                  :class="
                    projectMode === 'GROUP'
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  "
                  @click="projectMode = 'GROUP'"
                >
                  그룹
                </button>
              </div>

              <div class="flex items-center gap-2">
                <div class="relative w-full md:w-[320px]">
                  <input
                    v-model="q"
                    type="text"
                    placeholder="프로젝트 검색 (제목/지역)"
                    class="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400"
                  />
                </div>

                <select
                  v-model="sortKey"
                  class="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
                >
                  <option value="recent">최근 생성순</option>
                  <option value="start">여행 시작일순</option>
                  <option value="name">가나다순</option>
                </select>
              </div>
            </div>

            <div
              v-if="filteredProjects.length === 0"
              class="rounded-lg border border-dashed border-slate-200 p-10 text-center"
            >
              <p class="text-sm font-semibold text-slate-900">프로젝트가 없어요</p>
              <p class="mt-1 text-[13px] text-slate-500">
                새 프로젝트를 만들면 여기에서 한눈에 확인할 수 있어요.
              </p>
              <div class="mt-4 flex justify-center gap-2">
                <button
                  type="button"
                  class="cursor-pointer rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  프로젝트 만들기
                </button>
              </div>
            </div>

            <div v-else class="grid gap-4 md:grid-cols-2">
              <article
                v-for="p in filteredProjects"
                :key="p.projectId"
                role="button"
                tabindex="0"
                class="group cursor-pointer border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:bg-slate-50/40 focus:outline-none focus:ring-2 focus:ring-slate-300"
                @click="goProject(p)"
                @keydown.enter.prevent="goProject(p)"
                @keydown.space.prevent="goProject(p)"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        :class="
                          p.projectType === 'GROUP'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-sky-50 text-sky-700'
                        "
                      >
                        {{ p.projectType === 'GROUP' ? 'GROUP' : 'SOLO' }}
                      </span>
                      <span class="text-[11px] text-slate-400">·</span>
                      <span class="text-[11px] text-slate-500">{{ p.createdAt }}</span>
                    </div>

                    <h3 class="mt-2 truncate text-[15px] font-semibold text-slate-900">
                      {{ p.title }}
                    </h3>
                    <p class="mt-1 truncate text-[13px] text-slate-600">
                      {{ p.location }} · {{ p.startDate }} ~ {{ p.endDate }}
                    </p>
                  </div>
                </div>

                <div class="mt-4 flex items-center justify-between">
                  <p class="text-[12px] text-slate-500">멤버 {{ p.membersCount }}명</p>
                </div>

                <p class="mt-3 text-[12px] text-slate-400">클릭해서 프로젝트로 이동</p>
              </article>
            </div>
          </div>
        </section>

        <div
          v-if="editOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          @click.self="editOpen = false"
        >
          <div class="w-full max-w-lg border border-slate-200 bg-white">
            <div class="border-b border-slate-200 px-5 py-4">
              <p class="text-sm font-semibold text-slate-900">회원 정보 수정</p>
              <p class="mt-1 text-[12px] text-slate-500">UI만 먼저. 저장 누르면 API 연결하면 됨.</p>
            </div>

            <div class="p-5 space-y-4">
              <div>
                <p class="text-[12px] font-semibold text-slate-700">이름</p>
                <input
                  v-model="editForm.name"
                  type="text"
                  class="mt-1 w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <p class="text-[12px] font-semibold text-slate-700">이메일</p>
                <input
                  v-model="editForm.email"
                  type="email"
                  class="mt-1 w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <p class="text-[12px] font-semibold text-slate-700">프로필 이미지 URL</p>
                <input
                  v-model="editForm.profileImage"
                  type="text"
                  placeholder="없으면 비워두기"
                  class="mt-1 w-full border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400"
                />
              </div>
            </div>

            <div class="border-t border-slate-200 px-5 py-4 flex justify-end gap-2">
              <button
                type="button"
                class="cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                @click="editOpen = false"
              >
                취소
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                @click="applyEditUI"
              >
                저장(UI)
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="withdrawOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          @click.self="withdrawOpen = false"
        >
          <div class="w-full max-w-lg border border-rose-200 bg-white">
            <div class="border-b border-rose-200 px-5 py-4">
              <p class="text-sm font-semibold text-rose-700">회원 탈퇴</p>
              <p class="mt-1 text-[12px] text-slate-500">정말 탈퇴할까요? (UI만 먼저)</p>
            </div>

            <div class="p-5">
              <div class="rounded-lg bg-rose-50 p-4">
                <p class="text-sm font-semibold text-rose-700">주의</p>
                <ul class="mt-2 list-disc pl-5 text-[13px] text-rose-700 space-y-1">
                  <li>탈퇴 시 데이터 처리 정책(프로젝트/게시글/댓글) 확인 필요</li>
                  <li>실수 방지용 확인 문구 입력 UX 추천</li>
                </ul>
              </div>
            </div>

            <div class="border-t border-rose-200 px-5 py-4 flex justify-end gap-2">
              <button
                type="button"
                class="cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                @click="withdrawOpen = false"
              >
                취소
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                @click="withdrawOpen = false"
              >
                탈퇴(UI)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const me = reactive({
  name: '희수',
  email: 'heesu@example.com',
  profileImage: '',
  createdAt: '2025-12-01',
  role: 'USER',
})

const initials = (name = '') => {
  const t = (name ?? '').toString().trim()
  return t.slice(0, 1) || '?'
}

const projectMode = ref('ALL')
const q = ref('')
const sortKey = ref('recent')

const projects = ref([
  {
    projectId: 10,
    projectType: 'GROUP',
    title: '부산 3박 4일',
    location: '부산',
    startDate: '2026-02-10',
    endDate: '2026-02-13',
    membersCount: 4,
    createdAt: '2025-12-05',
  },
  {
    projectId: 22,
    projectType: 'SOLO',
    title: '도쿄 혼자 2박 3일',
    location: '도쿄',
    startDate: '2026-02-20',
    endDate: '2026-02-22',
    membersCount: 1,
    createdAt: '2025-12-07',
  },
])

const filteredProjects = computed(() => {
  const keyword = q.value.trim().toLowerCase()
  let list = projects.value.slice()

  if (projectMode.value !== 'ALL') {
    list = list.filter((p) => p.projectType === projectMode.value)
  }

  if (keyword) {
    list = list.filter((p) => {
      const a = (p.title ?? '').toLowerCase()
      const b = (p.location ?? '').toLowerCase()
      return a.includes(keyword) || b.includes(keyword)
    })
  }

  if (sortKey.value === 'name') {
    list.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
  } else if (sortKey.value === 'start') {
    list.sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''))
  } else {
    list.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
  }

  return list
})

const goProject = (p) => {
  if (!p?.projectId) return

  if (p.projectType === 'GROUP') {
    router.push(`/group/${p.projectId}`)
    return
  }

  router.push(`/solo/${p.projectId}`)
}

const editOpen = ref(false)
const withdrawOpen = ref(false)

const editForm = reactive({
  name: me.name,
  email: me.email,
  profileImage: me.profileImage,
})

const openEdit = () => {
  editForm.name = me.name
  editForm.email = me.email
  editForm.profileImage = me.profileImage
  editOpen.value = true
}

const openWithdraw = () => {
  withdrawOpen.value = true
}

const applyEditUI = () => {
  me.name = editForm.name
  me.email = editForm.email
  me.profileImage = editForm.profileImage
  editOpen.value = false
}

const InfoField = {
  props: { label: String, value: String },
  template: `
    <div class="border border-slate-200 bg-white p-4">
      <p class="text-[12px] font-semibold text-slate-700">{{ label }}</p>
      <p class="mt-1 truncate text-[14px] font-semibold text-slate-900">{{ value || '-' }}</p>
    </div>
  `,
}
</script>
