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
