import Axios from 'axios'

const Services = Axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
})

Services.interceptors.request.use(config => {
  const token = 'Bearer ' + sessionStorage.getItem('token')

  config.headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
  }

  return config
})

export default Services