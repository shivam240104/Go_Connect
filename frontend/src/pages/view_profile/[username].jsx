import { BaseURL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css"
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionRequest, getMyConnectionRequests, sendConnectionRequest } from '@/config/redux/action/authAction';

export default function ViewProfilePage({userprofile}) {


  const router = useRouter();
  const postReducer = useSelector((state)=> state.post);
  const dispatch = useDispatch();

  const authState = useSelector((state) =>state.auth)

  const [userPosts, setUserPosts] = useState([]);

  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true)


  const getUserPost = async () =>{
    await dispatch(getAllPosts());
    await dispatch(getConnectionRequest({token:localStorage.getItem("token")}));
    await dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}))
  }


  useEffect( () =>{

    let post = postReducer.posts.filter((post) =>{
      return post.userId.username === router.query.username
    })

    setUserPosts(post)
  }, [postReducer.posts])

  useEffect(() =>{
    console.log(authState.connections, userprofile.userId._id)

    if(authState.connections.some(user => user.connectionId._id === userprofile.userId._id)){
      setIsCurrentUserInConnection(true)

      if(authState.connections.find(user => user.connectionId._id === userprofile.userId._id).status_accepted === true){
        setIsConnectionNull(false)
      }
    }
    if(authState.connectionRequest.some(user => user.connectionId._id === userprofile.userId._id)){
      setIsCurrentUserInConnection(true)

      if(authState.connectionRequest.find(user => user.connectionId._id === userprofile.userId._id).status_accepted === true){
        setIsConnectionNull(false)
      }
    }
  }, [authState.connections, authState.connectionRequest])
  // useEffect(() => {
  // if (!authState.connections || authState.connections.length === 0) return;
  // if (!userprofile || !userprofile.userId) return;

  // const userId = userprofile.userId._id;   // correct reference

  // const found = authState.connections.find(
  //   user => user.connectionId?._id === userId
  // );

//   if (found) {
//     setIsCurrentUserInConnection(true);
//     if (found.status_accepted === true) {
//       setIsConnectionNull(false);
//     }
//   }
// }, [authState.connections]);


  useEffect(() =>{
    getUserPost();
  },[])

      const searchParamers = useSearchParams(); //client side 
  return (
    <UserLayout>
      <DashboardLayout>
      <div className= {styles.container}>
        <div className= {styles.backDropContainer}>
          <img src= {`${BaseURL}/${userprofile.userId.profilePicture}`} alt="" />

        </div>
        <div className= {styles.profileContainer_details}>
          <div className={styles.profile_flex}>

            <div style={{flex:"0.8"}}>

               <div style={{display:"flex",width:"fit-content",alignItems:"center", gap:"1.2rem"}}>
                <h2>{userprofile.userId.name}</h2>

                <p style={{color:"grey"}}>@{userprofile.userId.username}</p>

               </div>


               <div style={{display:"flex" , alignItems:"center", gap:"1.5rem"  }}>
                  {
                  isCurrentUserInConnection ? 
                  <button className= {styles.connectedButton}>{isConnectionNull?"Pending" :"Connected"}</button>
                  :
                  <button onClick={ () =>{
                    dispatch(sendConnectionRequest({ token: localStorage.getItem("token"),user_id:userprofile.userId._id}))
                  }}  className= {styles.connectBtn}>Connect

                  </button>
                }

                  <div onClick={async() =>{
                    const response = await clientServer.get(`/user/download_resume?user_id=${userprofile.userId._id}`);
                    window.open(`${BaseURL}/${response.data.message}`,"_blank")
                  }} style={{cursor:"pointer"}}>
                    <svg style={{width:"1.4em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>

                  </div>
               </div>
               <div>
                <p>{userprofile.bio}</p>
               </div>

            </div>

            <div style={{flex:"0.2"}}>
              <h3>Recent Activity</h3>
              {
                userPosts.map((post)=>{
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media !== "" ? <img src= {`${BaseURL}/${post.media}`} alt="" /> :<div style={{width:"3.4rem", height:"3.4rem"}}></div> }
                        </div>
                        <p>{post.body}</p>
                      </div>

                    </div>

                  )
                })
              }

            </div>

          </div>

        </div>

        <div className={styles.workHistory}>
          <h4>Work History</h4>

          <div className={styles.workHistoryContainer}>
            {
              userprofile.pastWork.map((work, index) =>{
                return(
                  <div key={index} className={styles.workHistoryCard}>
                    <p style={{fontWeight:"bold" , display:"flex", alignItems:"center", gap:"0.8rem" }}>
                      {work.company} - {work.position}
                    </p>
                    <p>{work.year}</p>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>

      </DashboardLayout>

    </UserLayout>
  )
}

//server side rendering

export async function getServerSideProps(context) {

  console.log("View")
  console.log(context.query.username)

  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params:{
      username: context.query.username
    }
  })

  const response = await request.data;
  console.log(response)



  return {props: {userprofile : request.data.profile} }
}