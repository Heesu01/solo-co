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

// 초대 링크 생성
export const createTravelInvite = (projectId) => {
  return api.post(`/api/travels/${projectId}/invite`)
}

// 초대 코드 검증
export const validateInviteCode = (code) => {
  return api.get('/api/travels/invite/validate', {
    params: { code },
  })
}

// 초대 참여
export const joinTravelInvite = (codeOrObj) => {
  const code = typeof codeOrObj === 'string' ? codeOrObj : (codeOrObj?.code ?? '')
  return api.post('/api/travels/invite/join', { code })
}

// 여행 상세 조회
export const fetchTravelDetail = (projectId) => {
  return api.get(`/api/travels/${projectId}`)
}

// 멤버 제거
export const removeMember = (projectId, memberId) => {
  return api.delete(`/api/travels/${projectId}/members/${memberId}`)
}

// 커뮤니티 글 작성
export const createTravelPost = ({ projectId, dto, images = [] }) => {
  const formData = new FormData()

  formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }))

  if (Array.isArray(images) && images.length > 0) {
    images.forEach((file) => {
      if (file) formData.append('images', file)
    })
  }

  return api.post(`/api/travels/${projectId}/posts`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// 커뮤니티 글 목록 조회
export const fetchTravelPosts = ({ projectId, query = '' } = {}) => {
  return api.get(`/api/travels/${projectId}/posts`, {
    params: query ? { query } : undefined,
  })
}

// 커뮤니티 글 상세 조회
export const fetchTravelPostDetail = ({ projectId, postId }) => {
  return api.get(`/api/travels/${projectId}/posts/${postId}`)
}

// 투표 참여
export const voteTravelPost = ({ projectId, postId, optionId }) => {
  return api.post(`/api/travels/${projectId}/posts/${postId}/vote`, {
    optionId,
  })
}

// 투표 결과 조회
export const fetchTravelPostVoteResult = ({ projectId, postId }) => {
  return api.get(`/api/travels/${projectId}/posts/${postId}/vote/result`)
}

// 투표 취소
export const cancelTravelPostVote = ({ projectId, postId }) => {
  return api.delete(`/api/travels/${projectId}/posts/${postId}/vote/cancel`)
}

// 댓글 작성
export const createTravelPostComment = ({ projectId, postId, content }) => {
  return api.post(`/api/travels/${projectId}/posts/${postId}/comments`, { content })
}

// 댓글 삭제
export const deleteTravelPostComment = ({ projectId, postId, commentId }) => {
  return api.delete(`/api/travels/${projectId}/posts/${postId}/comments/${commentId}`)
}
