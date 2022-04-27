import React, {
  useState,
  useEffect,
  useReducer,
  createContext
} from 'react'
import JWTDecode from 'jwt-decode'
import {
  AuthMethod,
  AuthReducer
} from '../../utilities'
import {
  PageLoader
} from '../../components'

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [state, dispatch] = useReducer(AuthReducer, {
    isAuthenticated: false,
    token: '',
    username: '',
    role: '',
  })

  const checkAuth = () => {
    const token = sessionStorage.getItem('token')
    
    if (!token) {
      return dispatch({type: AuthMethod.LOGOUT})
    }

    const decode = JWTDecode(token)
    const {username, hak} = decode
    
    return dispatch({
        type: AuthMethod.LOGIN, 
        payload: {
            token: token,
            username: username,
            role: hak
        }
    })
  }

  useEffect(() => {
    checkAuth()
    setIsLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{state, dispatch}}>
      {
        isLoading
          ? <PageLoader />
          : children
      }
    </AuthContext.Provider>
  )
}