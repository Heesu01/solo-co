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

// 로그인
export const login = async ({ username, password }) => {
  try {
    const res = await api.post('/api/auth/login', {
      username,
      password,
    })

    if (res.data?.token) {
      localStorage.setItem('token', res.data.token)

      localStorage.setItem(
        'user',
        JSON.stringify({
          username: res.data.username,
          email: res.data.email,
          name: res.data.name,
        }),
      )
    }

    return res.data
  } catch (err) {
    console.error('로그인 실패:', err.response?.data || err.message)
    throw err
  }
}

// 로그아웃
export const logout = async () => {
  try {
    const res = await api.post('/api/auth/logout')

    return res.data
  } catch (err) {
    console.error('로그아웃 실패:', err.response?.data || err.message)
    throw err
  }
}
