import { BaseURL } from '@/config';
import { acceptConnectionRequest, getMyConnectionRequests } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./index.module.css"
import { useRouter } from 'next/router';

export default function MyConnectionPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth)

  const router = useRouter();
  useEffect(() =>{
    dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}))

  },[])

  useEffect(() =>{
    if(authState.connectionRequest.length != 0){
    console.log(authState.connectionRequest)
    }
  }, [authState.connectionRequest])
  return (
    <UserLayout>
            
            <DashboardLayout>
              <div style={{display:"flex", flexDirection:"column", gap:"1.9rem"  }}>
                <h4>My_Connections</h4>
                
                {authState.connectionRequest.length=== 0 && <h1>No connection request pending</h1>}
                {authState.connectionRequest.length  !=0 && authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user, index) =>{
                  return (
                    <div  onClick={ () =>{
                      router.push(`/view_profile/${user.connectionId.username}`)
                    }} className={styles.userCard} key={index}> 
                    <div style={{display:"flex" , alignItems:"center", gap:"1.2rem"}}>
                      <div className={styles.profilePicture}>
                        <img src={`${BaseURL}/${user.connectionId.profilePicture}`} alt="" />
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{user.connectionId.name}</h3>
                        <p>{user.connectionId.username}</p>
                      </div>
                      <button onClick={(e) =>{
                        e.stopPropagation();
                        dispatch(acceptConnectionRequest({
                          connection_id:user.connectionId,
                          token :localStorage.getItem("token"),
                          action_type: "accept"
                        }))
                      }} className= {styles.connectedButton}>Accepted</button>
                    </div>

                    </div>

                  )
                })}

                <h4>My Network</h4>

                { authState.connectionRequest.filter((connection) =>connection.status_accepted !== null).map((user, index) =>{
                  return (
                    <div  onClick={ () =>{
                      router.push(`/view_profile/${user.connectionId.username}`)
                    }} className={styles.userCard} key={index}> 
                    <div style={{display:"flex" , alignItems:"center", gap:"1.2rem"}}>
                      <div className={styles.profilePicture}>
                        <img src={`${BaseURL}/${user.connectionId.profilePicture}`} alt="" />
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{user.connectionId.name}</h3>
                        <p>{user.connectionId.username}</p>
                      </div>
                      
                     
                    </div>

                    </div>

                  )

                })}
              </div>
            </DashboardLayout>


        </UserLayout>
  )
}
