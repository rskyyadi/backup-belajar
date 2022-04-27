export const AuthMethod = {
  CHECK: 'CHECK',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',

}
export const AuthReducer = (prevState, action) => {
  switch (action.type) {
    case AuthMethod.LOGIN:
      // localStorage.setItem('token', action.payload.token)
      sessionStorage.setItem('token', action.payload.token)

      return {
        isAuthenticated: true,
        token: action.payload.token,
        username: action.payload.username,
        role: action.payload.role
      }
      case AuthMethod.LOGOUT:
        // localStorage.removeItem('token')
        sessionStorage.removeItem('token')

        return {
          isAuthenticated: false,
          token: '',
          username: '',
          role: ''
        }
    default: {
      return prevState
    }
  }
}

