import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css"
import { BaseURL, clientServer } from '@/config'
import { getAboutUser } from '@/config/redux/action/authAction'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '@/config/redux/action/postAction'

export default function ProfilePage() {

    const dispatch = useDispatch();
    const [userprofile, setUserProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const postReducer = useSelector((state)=> state.post);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [companyName, setCompanyName] =useState("");
    const [inputData, setInputData] = useState({company:"" , position:"", years:""});

    const handleWorkInput = (e) =>{
      const {name, value} = e.target;
      setInputData({...inputData, [name]:value});
    }

    //     userId :{
    //         name:"",
    //         username:"",
    //         profilePicture:""
    //     },
    //     bio:"",
    //     pastWork:[]

    // })

    const authState = useSelector((state) => state.auth)

    useEffect(() =>{
        dispatch(getAboutUser({token : localStorage.getItem("token")}))
        dispatch(getAllPosts())
    }, [])

    useEffect(() =>{
        
        
        if(authState.user != undefined){
            setUserProfile(authState.user)
            
                      let post = postReducer.posts.filter((post) =>{
                      return post.userId.username === authState.user.userId.username
                    })

                    setUserPosts(post)
        }
    

    }, [authState.user, postReducer.posts])



    const updateProfilePicture = async (file) =>{
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("token", localStorage.getItem("token"));

        const response = await clientServer.post("/update_profile_picture", formData, {
            headers:{
                'Content-Type' : 'multipart/form-data',
            },
        });

        dispatch(getAboutUser({token : localStorage.getItem("token")}))
    }

    const updateProfileData = async () => {
      const request = await clientServer.post("/user_update", {
        token: localStorage.getItem("token"),
        // name: userprofile.userId.username,

      });

      const response = await clientServer.post("/update_profile_data", {
        token: localStorage.getItem("token"),
        bio:userprofile.bio,
        currentPost : userprofile.currentPost,
        pastWork : userprofile.pastWork,
        education : userprofile.education
      
      })

      dispatch(getAboutUser({token:localStorage.getItem("token")}))
    }

    
  return (
    <UserLayout>
        
            <DashboardLayout>

                {authState.user && userprofile.userId &&

                <div className= {styles.container}>
        <div className= {styles.backDropContainer}>
            <label htmlFor='profilepictureupload' className={styles.backDrop_overlay}>
                <p>Edit</p>
            </label>
            <input onChange={(e) =>{
                updateProfilePicture(e.target.files[0])
            }} type="file"  hidden id='profilepictureupload' />
          <img className={styles.backDrop} src= {`${BaseURL}/${userprofile.userId.profilePicture}`} alt="" />

        </div>
        <div className= {styles.profileContainer_details}>
          <div style={{display:"flex", gap:"0.7rem"}}>

            <div style={{flex:"0.8"}}>

               <div style={{display:"flex", width:"fit-content", alignItems:"center", gap:"1.2rem" }}>
                <input className={styles.nameEdit} type="text" value={userprofile.userId.name} onChange={(e) =>{
                  setUserProfile({...userprofile, userId :{...userprofile.userId, name: e.target.value}})
                }}  />
                <p style={{color:"grey"}}>@{userprofile.userId.username}</p>
               </div>


              
               
               <div>
                <textarea 
                   value={userprofile.bio}
                   onChange={ (e) =>{
                    setUserProfile({...userprofile, bio : e.target.value})
                   }}

                   rows={Math.max(3, Math.ceil(userprofile.bio.length/80))}
                   style={{width:"100%"}}
                />
                
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

            <button onClick={()=>{
              setIsModalOpen(true)
            }} className={styles.addWorkButton}>Add Work</button>
          </div>
        </div>


        {userprofile != authState.user &&

            <div onClick={() =>{
              updateProfileData();
            }} className= {styles.updateBtn}>Update Profile</div>
        
        }







      </div>
}
            {
               isModalOpen  &&

                <div onClick={ () =>{
                  setIsModalOpen(false)
                }} className={styles.commentsContainer}>

                  <div onClick={(e) =>{
                    e.stopPropagation()
                  }} className={styles.allCommentsContainer} >

                     <input onChange={handleWorkInput} name='company' className={styles.inputfield} type="text"  placeholder='Enter Company'/>
                     <input onChange={handleWorkInput} name='position' className={styles.inputfield} type="text"  placeholder='Enter Position'/>
                     <input onChange={handleWorkInput} name='years' className={styles.inputfield} type="number"  placeholder='Years Experience'/>
                     <div onClick={() =>{
                      setUserProfile({...userprofile, pastWork:[...userprofile.pastWork, inputData]})
                      setIsModalOpen(false)
                     }}  className={styles.updateBtn}>
                      Add Work
                     </div>


                  
                            </div>
                          
                      
                    
                    

              

                    
                    

                  </div>

              


                
              }



            </DashboardLayout>
    
    </UserLayout>
  )
}
