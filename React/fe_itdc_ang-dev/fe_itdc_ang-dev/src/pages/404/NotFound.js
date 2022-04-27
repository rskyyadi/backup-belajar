import React, {
  useEffect
} from 'react'

const NotFound = ({setNavbarTitle}) => {

  useEffect(() => {
    setNavbarTitle('404 - Halaman Tidak Ditemukan')
  }, [setNavbarTitle])

  return (
    <div
      style={{
        height: '75vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <h4>404 - Halaman Tidak Ditemukan</h4>
    </div>
  )
}

export default NotFound
