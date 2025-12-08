import api from '@/api/index'

// 회원가입
export const signup = async ({ username, password, email, name }) => {
  try {
    const res = await api.post('/api/auth/signup', {
      username,
      password,
      email,
      name,
    })

    return res.data
  } catch (err) {
    console.error('회원가입 실패:', err.response?.data || err.message)
    throw err
  }
}
