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

          <div v-if="meLoading" class="p-10 text-center text-slate-500">불러오는 중...</div>
          <div v-else-if="meError" class="p-10 text-center text-rose-600">
            {{ meError }}
          </div>

          <div v-else class="p-6">
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
                  <p class="truncate text-[15px] font-semibold text-slate-900">
                    {{ me.name || '-' }}
                  </p>
                  <p class="mt-0.5 truncate text-[12px] text-slate-500">
                    {{ me.email || '-' }}
                  </p>
                  <p class="mt-1 text-[12px] text-slate-500">
                    아이디 <span class="text-slate-400">·</span> {{ me.id || '-' }}
                  </p>
                </div>
              </div>
              <div class="flex gap-2 md:justify-end">
                <button
                  type="button"
                  class="cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="meLoading"
                  @click="openEdit"
                >
                  정보 수정
                </button>

                <button
                  type="button"
                  class="cursor-pointer rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="withdrawSubmitting"
                  @click="confirmWithdraw"
                >
                  {{ withdrawSubmitting ? '처리 중...' : '탈퇴' }}
                </button>
              </div>
            </div>

            <div class="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <InfoField label="아이디" :value="me.id" />
              <InfoField label="이름" :value="me.name" />
              <InfoField label="이메일" :value="me.email" />
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

            <div v-if="filteredProjects.length === 0" class="rounded-lg p-4">
              <p class="text-sm text-slate-500">프로젝트가 없어요.</p>
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
                  <p class="text-[12px] text-slate-500">진행도 {{ p.progress }}%</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <div
          v-if="editOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          @click.self="closeEdit"
        >
          <div class="w-full max-w-lg border border-slate-200 bg-white">
            <div class="border-b border-slate-200 px-5 py-4">
              <p class="text-sm font-semibold text-slate-900">회원 정보 수정</p>
              <p class="mt-1 text-[12px] text-slate-500">
                이름/이메일/비밀번호/프로필 이미지를 수정할 수 있어요.
              </p>
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
                <p class="text-[12px] font-semibold text-slate-700">비밀번호</p>
                <input
                  v-model="editForm.password"
                  type="password"
                  placeholder="변경할 때만 입력"
                  class="mt-1 w-full border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400"
                />
              </div>

              <div>
                <p class="text-[12px] font-semibold text-slate-700">프로필 이미지</p>

                <div class="mt-2 flex items-center gap-3">
                  <div
                    class="h-12 w-12 overflow-hidden rounded-full ring-1 ring-slate-200 bg-white"
                  >
                    <img
                      v-if="previewUrl"
                      :src="previewUrl"
                      alt=""
                      class="h-full w-full object-cover"
                    />
                    <img
                      v-else-if="me.profileImage"
                      :src="me.profileImage"
                      alt=""
                      class="h-full w-full object-cover"
                    />
                    <div
                      v-else
                      class="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500"
                    >
                      {{ initials(me.name) }}
                    </div>
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="truncate text-[12px] font-semibold text-slate-800">
                      {{ pickedFileName || '선택된 파일 없음' }}
                    </p>
                    <p class="mt-0.5 text-[11px] text-slate-500">
                      파일을 선택하지 않으면 기존 이미지를 유지해요.
                    </p>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      @click="openFilePicker"
                    >
                      파일 선택
                    </button>

                    <button
                      v-if="pickedFile"
                      type="button"
                      class="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      @click="clearPickedFile"
                    >
                      선택 해제
                    </button>
                  </div>

                  <input
                    ref="fileInputRef"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="onPickFile"
                  />
                </div>
              </div>

              <p v-if="editError" class="text-[12px] font-medium text-rose-600">
                {{ editError }}
              </p>
            </div>

            <div class="border-t border-slate-200 px-5 py-4 flex justify-end gap-2">
              <button
                type="button"
                class="cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                :disabled="editSubmitting"
                @click="closeEdit"
              >
                취소
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="editSubmitting"
                @click="submitEdit"
              >
                {{ editSubmitting ? '저장 중...' : '저장' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchMyProfile, updateMyProfile, deleteMyAccount } from '@/api/my'

const router = useRouter()

const pickPayload = (res) => {
  const a = res?.data ?? res
  const b = a?.data ?? a
  return b
}

const meLoading = ref(false)
const meError = ref('')

const me = reactive({
  id: '',
  name: '',
  email: '',
  profileImage: '',
})

const initials = (name = '') => {
  const t = (name ?? '').toString().trim()
  return t.slice(0, 1) || '?'
}

const loadMe = async () => {
  meLoading.value = true
  meError.value = ''
  try {
    const res = await fetchMyProfile()
    const data = pickPayload(res)

    me.id = data?.id ?? ''
    me.name = data?.name ?? ''
    me.email = data?.email ?? ''
    me.profileImage = data?.profileImage ?? ''
  } catch (e) {
    console.error('[MyPage] loadMe error:', e)
    meError.value = '회원 정보를 불러오지 못했어요.'
  } finally {
    meLoading.value = false
  }
}

onMounted(loadMe)

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
    progress: 52,
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
    progress: 18,
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
const editSubmitting = ref(false)
const editError = ref('')

const editForm = reactive({
  name: '',
  email: '',
  password: '',
})

const pickedFile = ref(null)
const fileInputRef = ref(null)
const previewUrl = ref('')

const pickedFileName = computed(() => pickedFile.value?.name || '')

const openFilePicker = () => {
  fileInputRef.value?.click?.()
}

const clearPickedFile = () => {
  pickedFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const openEdit = () => {
  editError.value = ''
  editForm.name = me.name
  editForm.email = me.email
  editForm.password = ''
  pickedFile.value = null

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''

  editOpen.value = true
}

const closeEdit = () => {
  if (editSubmitting.value) return
  editOpen.value = false
}

const onPickFile = (e) => {
  const file = e?.target?.files?.[0]
  if (!file) return

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)

  pickedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

const submitEdit = async () => {
  editError.value = ''

  const dto = {
    name: (editForm.name ?? '').trim(),
    email: (editForm.email ?? '').trim(),
  }

  const pw = (editForm.password ?? '').trim()
  if (pw) dto.password = pw

  if (!dto.name) {
    editError.value = '이름을 입력해주세요.'
    return
  }
  if (!dto.email) {
    editError.value = '이메일을 입력해주세요.'
    return
  }

  editSubmitting.value = true
  try {
    await updateMyProfile({
      dto,
      file: pickedFile.value,
    })

    await loadMe()
    editOpen.value = false
  } catch (e) {
    console.error('정보수정실패:', e)
    editError.value = '정보 수정에 실패했어요.'
  } finally {
    editSubmitting.value = false
  }
}

const withdrawSubmitting = ref(false)

const clearAuthStorage = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

const confirmWithdraw = async () => {
  if (withdrawSubmitting.value) return

  const ok = confirm('정말 탈퇴할까요? 탈퇴 후에는 복구할 수 없어요.')
  if (!ok) return

  withdrawSubmitting.value = true
  try {
    await deleteMyAccount()

    clearAuthStorage()
    alert('탈퇴가 완료됐어요.')

    await router.replace('/login')
    window.location.replace('/login')
  } catch (e) {
    console.error('탈퇴실패:', e)

    alert('탈퇴에 실패했어요.')
  } finally {
    withdrawSubmitting.value = false
  }
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
