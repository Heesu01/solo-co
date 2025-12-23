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

// 경로 조회
export const fetchItinerary = async ({ projectId }) => {
  const res = await api.get(`/api/travels/${projectId}/itinerary`)
  return res?.data?.data ?? res?.data
}

// 경로 수정
export const updateItinerary = async ({ projectId, places = [] }) => {
  const payload = {
    places: Array.isArray(places) ? places : [],
  }
  const res = await api.put(`/api/travels/${projectId}/itinerary`, payload)
  return res?.data
}

// 경로 전체 삭제
export const deleteItinerary = async ({ projectId }) => {
  const res = await api.delete(`/api/travels/${projectId}/itinerary`)
  return res?.data
}

// 장소 검색
export const searchPlaces = async ({ projectId, query, location, type, nextPageToken }) => {
  const res = await api.get('/api/places/search', {
    params: {
      projectId,
      query,
      location,
      type,
      nextPageToken,
    },
  })

  return res?.data
}

// 장소 상세 조회
export const fetchPlaceDetails = async ({ projectId, placeId }) => {
  const res = await api.get(`/api/places/${placeId}/details`, {
    params: { projectId },
  })
  return res?.data
}
