<template>
  <aside class="space-y-4">
    <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div class="relative h-40 bg-slate-100">
        <img
          v-if="group?.thumbnail"
          :src="group.thumbnail"
          alt="cover"
          class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-white/70"></div>
      </div>

      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-[11px] font-semibold tracking-[0.14em] text-slate-400">GROUP TRIP</p>
            <h1 class="mt-1 truncate text-[15px] font-semibold text-slate-900">
              {{ group?.title || (loading ? '불러오는 중…' : '') }}
            </h1>
          </div>

          <span
            class="shrink-0 inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold"
            :class="statusChipClass(group?.status)"
          >
            {{ statusLabel(group?.status) }}
          </span>
        </div>

        <div class="mt-3 space-y-2 text-[12px] text-slate-700">
          <div class="flex items-center gap-2">
            <MapPinIcon class="h-4 w-4 text-slate-400" />
            <span class="truncate">{{ group?.location || '-' }}</span>
          </div>

          <div class="flex items-center gap-2">
            <CalendarDaysIcon class="h-4 w-4 text-slate-400" />
            <p class="font-medium text-slate-700">
              {{ group?.startDate || '-' }} ~ {{ group?.endDate || '-' }}
            </p>
          </div>
        </div>

        <p v-if="errorMsg" class="mt-3 text-[12px] font-medium text-rose-600">
          {{ errorMsg }}
        </p>
      </div>

      <div class="border-t border-slate-200"></div>

      <div class="p-4">
        <div class="flex items-end justify-between">
          <h2 class="text-sm font-semibold text-slate-900">멤버</h2>
          <p class="text-[12px] text-slate-500">{{ membersCount }}명</p>
        </div>
        <p class="mt-1 text-[12px] text-slate-500">참여 멤버 관리</p>

        <ul class="mt-3 space-y-1">
          <li
            v-for="m in members"
            :key="m.userId"
            class="group flex items-center justify-between rounded-lg px-2 py-2 hover:bg-slate-50"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="h-8 w-8 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
                <img
                  v-if="m.profileImage"
                  :src="m.profileImage"
                  class="h-full w-full object-cover"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500"
                >
                  {{ initials(m.name) }}
                </div>
              </div>

              <div class="min-w-0">
                <p class="truncate text-[13px] font-semibold text-slate-900">
                  {{ m.name }}
                  <span
                    v-if="m.role === 'OWNER'"
                    class="ml-1 rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700"
                  >
                    방장
                  </span>
                </p>
                <p class="truncate text-[11px] text-slate-500">@{{ m.username }}</p>
              </div>
            </div>

            <button
              class="cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium text-slate-600 opacity-0 transition group-hover:opacity-100 hover:bg-white hover:text-rose-600"
              type="button"
              @click.stop="onRemoveMember(m)"
            >
              삭제
            </button>
          </li>
        </ul>

        <div class="mt-4 border-t border-slate-200 pt-5">
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              class="cursor-pointer flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!projectId"
              @click="goToItinerary"
            >
              일정 보기
            </button>
            <button
              type="button"
              class="cursor-pointer flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-start to-end text-sm font-semibold text-white shadow-md transition hover:from-start-hover hover:to-end-hover disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!projectId"
              @click="goToTravel"
            >
              일정 짜기
            </button>
          </div>

          <p class="mt-2 text-[11px] text-slate-500">
            프로젝트 장소를 기반으로 일정 후보를 생성하고 확인할 수 있어요.
          </p>
        </div>
      </div>
    </section>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MapPinIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'
import { fetchTravelDetail, removeMember } from '@/api/group'

defineEmits(['manage-member'])

const route = useRoute()
const router = useRouter()

const group = ref(null)
const members = ref([])

const loading = ref(false)
const errorMsg = ref('')

const projectId = computed(() => route.params.id)
const membersCount = computed(() => (Array.isArray(members.value) ? members.value.length : 0))

const pickPayload = (res) => {
  const a = res?.data ?? res
  const b = a?.data ?? a
  return b
}

const load = async () => {
  const pid = route.params.id
  if (!pid) return

  loading.value = true
  errorMsg.value = ''

  try {
    const res = await fetchTravelDetail(pid)
    const payload = pickPayload(res)
    group.value = payload?.project ?? null
    members.value = Array.isArray(payload?.members) ? payload.members : []
  } catch (e) {
    errorMsg.value = '그룹 정보를 불러오지 못했어요.'
    group.value = null
    members.value = []
  } finally {
    loading.value = false
  }
}

const goToTravel = () => {
  const pid = route.params.id
  if (!pid) return
  router.push(`/group/${pid}/travel`)
}

const goToItinerary = () => {
  const pid = route.params.id
  if (!pid) return
  router.push(`/group/${pid}/itinerary`)
}

const onRemoveMember = async (member) => {
  const pid = route.params.id
  if (!pid || !member?.userId) return

  if (!confirm(`${member.name}님을 삭제할까요?`)) return

  try {
    await removeMember(pid, member.userId)
    members.value = members.value.filter((m) => m.userId !== member.userId)
  } catch (e) {
    const status = e?.response?.status
    if (status === 401 || status === 403) {
      alert('방장만 멤버를 삭제할 수 있어요.')
      return
    }
    alert('삭제에 실패했어요. 잠시 후 다시 시도해 주세요.')
  }
}

onMounted(load)
watch(() => route.params.id, load)

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
