import api from '@/api/index'

// 여행 생성
export const createTravel = ({ dto, thumbnailFile }) => {
  const formData = new FormData()

  formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }))

  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile)
  }

  return api.post('/api/travels', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 그룹 여행 목록 조회
export const fetchGroupTravels = () => {
  return api.get('/api/travels', {
    params: { projectType: 'GROUP' },
  })
}

// 여행 수정
export const updateTravel = ({ projectId, dto, thumbnailFile }) => {
  const formData = new FormData()

  formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }))

  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile)
  }

  return api.put(`/api/travels/${projectId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 여행 삭제
export const deleteTravel = (projectId) => {
  return api.delete(`/api/travels/${projectId}`)
}
