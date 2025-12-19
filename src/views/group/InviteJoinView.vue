<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
      <div v-if="isLoading" class="text-sm text-slate-500 text-center py-6">
        초대 정보를 확인하는 중이에요...
      </div>

      <div v-else-if="isError || !inviteInfo?.valid" class="space-y-4 text-center">
        <p class="text-base font-semibold text-slate-900">유효하지 않은 초대 링크예요</p>
        <p class="text-sm text-slate-500">
          링크가 만료되었거나 잘못된 코드일 수 있어요.<br />
          초대한 사람에게 다시 링크를 요청해 주세요.
        </p>
        <button
          type="button"
          class="mt-2 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          @click="goHome"
        >
          홈으로 가기
        </button>
      </div>

      <div v-else class="space-y-5">
        <header class="space-y-1">
          <p class="text-[11px] font-medium uppercase tracking-[0.18em] text-sky-500">
            GROUP TRAVEL INVITE
          </p>
          <h1 class="text-lg font-semibold text-slate-900">
            "{{ inviteInfo.projectTitle }}" 여행에 초대되었어요
          </h1>
          <p class="text-sm text-slate-500">
            여행지: <span class="font-medium text-slate-800">{{ inviteInfo.location }}</span>
          </p>
        </header>

        <div class="rounded-2xl bg-slate-50 px-3 py-3 text-[13px] text-slate-600">
          <p>이 그룹 여행에 참여하면,</p>
          <ul class="mt-2 list-disc pl-4 space-y-1">
            <li>여행 일정과 장소를 함께 확인하고 수정할 수 있어요.</li>
            <li>다른 멤버들과 같은 화면에서 그룹 여행을 준비할 수 있어요.</li>
          </ul>
        </div>

        <div class="flex flex-col gap-2 pt-2">
          <button
            type="button"
            class="h-10 w-full rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-40"
            :disabled="isJoining"
            @click="handleJoin"
          >
            {{ isJoining ? '참여 중...' : '이 여행에 참여하기' }}
          </button>

          <button
            type="button"
            class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100"
            @click="goHome"
          >
            우선 홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { validateInviteCode, joinTravelInvite } from '@/api/group'

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)
const isError = ref(false)
const isJoining = ref(false)
const inviteInfo = ref(null)

const inviteCode = route.params.code

const isLoggedIn = () => {
  return !!localStorage.getItem('token')
}

if (!isLoggedIn()) {
  router.push({
    path: '/login',
    query: { redirect: route.fullPath },
  })
} else {
  onMounted(loadInviteInfo)
}

async function loadInviteInfo() {
  if (!inviteCode) {
    isError.value = true
    return
  }

  isLoading.value = true
  isError.value = false

  try {
    const res = await validateInviteCode(inviteCode)
    const payload = res.data
    const data = payload?.data || payload

    inviteInfo.value = {
      valid: data.valid,
      projectId: data.projectId,
      projectTitle: data.projectTitle,
      location: data.location,
    }
  } catch (e) {
    console.error('초대 코드 검증 실패:', e)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

const handleJoin = async () => {
  if (!inviteCode) return

  isJoining.value = true
  try {
    await joinTravelInvite(inviteCode)
    alert('프로젝트 참여가 완료되었어요!')

    if (inviteInfo.value?.projectId) {
      router.push(`/group/${inviteInfo.value.projectId}`)
    } else {
      router.push('/group')
    }
  } catch (e) {
    if (e.response?.status === 401) {
      alert('로그인이 필요해요. 다시 로그인해 주세요.')
      router.push({
        path: '/login',
        query: { redirect: route.fullPath },
      })
      return
    }
    console.error('초대 참여 실패:', e)
    alert('참여에 실패했어요. 다시 시도해 주세요.')
  } finally {
    isJoining.value = false
  }
}

const goHome = () => {
  router.push('/group')
}
</script>
