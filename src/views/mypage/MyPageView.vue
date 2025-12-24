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
                    이메일 <span class="text-slate-400">·</span> {{ me.email || '-' }}
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
                    projectMode === 'PERSONAL'
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  "
                  @click="projectMode = 'PERSONAL'"
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
                    placeholder="프로젝트를 검색하세요."
                    class="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400"
                  />
                </div>

                <select
                  v-model="sortKey"
                  class="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
                >
                  <option value="start">여행 시작일순</option>
                  <option value="name">가나다순</option>
                  <option value="status">상태별</option>
                </select>
              </div>
            </div>

            <div v-if="projectsLoading" class="rounded-lg p-4">
              <p class="text-sm text-slate-500">프로젝트 불러오는 중...</p>
            </div>

            <div v-else-if="projectsError" class="rounded-lg p-4">
              <p class="text-sm text-rose-600">{{ projectsError }}</p>
            </div>

            <div v-else-if="filteredProjects.length === 0" class="rounded-lg p-4">
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
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <span
                        class="-ml-2 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        :class="
                          p.projectType === 'GROUP'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-sky-50 text-sky-700'
                        "
                      >
                        {{ p.projectType === 'GROUP' ? 'GROUP' : 'SOLO' }}
                      </span>
                    </div>

                    <h3 class="mt-2 truncate text-[15px] font-semibold text-slate-900">
                      {{ p.title }}
                    </h3>

                    <div
                      class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500"
                    >
                      <span class="inline-flex items-center gap-1">
                        <MapPinIcon class="h-3.5 w-3.5" />
                        {{ p.location || '-' }}
                      </span>

                      <span class="inline-flex items-center gap-1">
                        <CalendarIcon class="h-3.5 w-3.5" />
                        {{ dateLabel(p.startDate, p.endDate) }}
                      </span>

                      <span class="inline-flex items-center gap-1">
                        <UsersIcon class="h-3.5 w-3.5" />
                        {{ p.memberCount ?? '-' }}명
                      </span>

                      <span
                        class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        :class="statusClass(p.status)"
                      >
                        <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(p.status)" />
                        {{ statusLabel(p.status) }}
                      </span>
                    </div>
                  </div>

                  <div
                    class="h-[92px] w-[132px] shrink-0 overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    <img
                      v-if="p.thumbnail"
                      :src="p.thumbnail"
                      alt=""
                      class="h-full w-full object-cover transition group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div
                      v-else
                      class="flex h-full w-full items-center justify-center text-[11px] font-semibold text-slate-400"
                    >
                      NO IMAGE
                    </div>
                  </div>
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
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchMyProfile, updateMyProfile, deleteMyAccount, fetchTravels } from '@/api/my'
import { MapPinIcon, CalendarIcon, UsersIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { setUserName } = useAuth()
const { clearAuth } = useAuth()

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

const projectMode = ref('ALL')
const q = ref('')
const sortKey = ref('start')

const dateLabel = (start, end) => {
  const s = (start ?? '').toString().trim()
  const e = (end ?? '').toString().trim()
  if (!s && !e) return '-'
  if (s && !e) return s
  if (!s && e) return e
  return `${s} ~ ${e}`
}

const projectsLoading = ref(false)
const projectsError = ref('')
const projects = ref([])

const loadProjects = async () => {
  projectsLoading.value = true
  projectsError.value = ''
  try {
    const res = await fetchTravels({
      projectType: projectMode.value,
    })
    const data = pickPayload(res)
    projects.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('[MyPage] loadProjects error:', e)
    const status = e?.response?.status
    if (status === 401) projectsError.value = '로그인이 필요해요.'
    else projectsError.value = '프로젝트를 불러오지 못했어요.'
  } finally {
    projectsLoading.value = false
  }
}

onMounted(async () => {
  await loadMe()
  await loadProjects()
})

watch(projectMode, () => {
  loadProjects()
})

const statusLabel = (s) => {
  if (s === 'UPCOMING') return '예정'
  if (s === 'IN_PROGRESS') return '진행 중'
  if (s === 'DONE') return '완료'
  return s || '-'
}

const statusClass = (s) => {
  if (s === 'IN_PROGRESS') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (s === 'DONE') return 'bg-slate-100 text-slate-700 border border-slate-200'
  return 'bg-sky-50 text-sky-700 border border-sky-200'
}

const statusDotClass = (s) => {
  if (s === 'IN_PROGRESS') return 'bg-emerald-500'
  if (s === 'DONE') return 'bg-slate-500'
  return 'bg-sky-500'
}

const statusOrder = (s) => {
  if (s === 'UPCOMING') return 0
  if (s === 'IN_PROGRESS') return 1
  if (s === 'DONE') return 2
  return 99
}

const filteredProjects = computed(() => {
  const keyword = q.value.trim().toLowerCase()
  let list = projects.value.slice()

  if (keyword) {
    list = list.filter((p) => {
      const a = (p.title ?? '').toLowerCase()
      const b = (p.location ?? '').toLowerCase()
      return a.includes(keyword) || b.includes(keyword)
    })
  }

  if (sortKey.value === 'name') {
    list.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
  } else if (sortKey.value === 'status') {
    list.sort((a, b) => {
      const ao = statusOrder(a.status)
      const bo = statusOrder(b.status)
      if (ao !== bo) return ao - bo
      return (a.startDate ?? '').localeCompare(b.startDate ?? '')
    })
  } else {
    list.sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''))
  }

  return list
})

const goProject = (p) => {
  if (!p?.projectId) return
  if (p.projectType === 'GROUP') router.push(`/group/${p.projectId}`)
  else router.push(`/solo/${p.projectId}`)
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

const openFilePicker = () => fileInputRef.value?.click?.()

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

  if (!dto.name) return (editError.value = '이름을 입력해주세요.')
  if (!dto.email) return (editError.value = '이메일을 입력해주세요.')

  editSubmitting.value = true
  try {
    await updateMyProfile({ dto, file: pickedFile.value })
    setUserName(dto.name)
    await loadMe()
    editOpen.value = false
  } catch (e) {
    console.error('[MyPage] update error:', e)
    const status = e?.response?.status
    if (status === 401) editError.value = '로그인이 필요해요.'
    else editError.value = '정보 수정에 실패했어요.'
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
    clearAuth()
    clearAuthStorage()
    alert('탈퇴가 완료됐어요.')
    await router.replace('/login')
    window.location.replace('/login')
  } catch (e) {
    console.error('[MyPage] withdraw error:', e)
    const status = e?.response?.status
    if (status === 401) alert('로그인이 필요해요.')
    else alert('탈퇴에 실패했어요.')
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
