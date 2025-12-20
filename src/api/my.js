import api from '@/api/index'

// 정보 조회
export const fetchMyProfile = () => {
  return api.get('/api/users')
}

// 회원 탈퇴
export const deleteMyAccount = () => {
  return api.delete('/api/users')
}

// 회원 정보 수정
export const updateMyProfile = ({ dto, file }) => {
  const formData = new FormData()

  formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }))

  if (file) {
    formData.append('file', file)
  }

  return api.put('/api/users', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
