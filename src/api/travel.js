import api from '@/api/index'

// 추가 목록 조회
export const fetchTravelPlaces = async ({ projectId, sortBy = 'createdAt', order = 'desc' }) => {
  const res = await api.get(`/api/travels/${projectId}/places`, {
    params: { sortBy, order },
  })
  return Array.isArray(res?.data) ? res.data : (res?.data?.data ?? [])
}

// 장소 추가
export const addTravelPlace = async ({ projectId, placeId }) => {
  return api.post(`/api/travels/${projectId}/places/${placeId}`)
}

// 장소 삭제
export const deleteTravelPlace = async ({ projectId, placeId }) => {
  return api.delete(`/api/travels/${projectId}/places/${placeId}`)
}

// 일정 자동 생성
export const autoGenerateItinerary = async ({ projectId }) => {
  const res = await api.post(`/api/travels/${projectId}/itinerary/auto-generate`, null, {
    timeout: 100000,
  })
  return res?.data?.data ?? res?.data
}

// AI 일정 선택
export const selectAiItinerary = async ({ projectId, aiResultId, routeType }) => {
  const res = await api.post(`/api/travels/${projectId}/itinerary/ai-select`, {
    aiResultId,
    routeType: routeType,
  })
  return res?.data
}
