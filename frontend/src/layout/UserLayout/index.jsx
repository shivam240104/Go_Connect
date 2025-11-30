import NavBarComponent from '@/Components/Navbar'
import React from 'react'

function UserLayout({children}) {
  return (
    <>
    <NavBarComponent/>
    
    <div>{children}</div>
    </>
  )
}

export default UserLayout