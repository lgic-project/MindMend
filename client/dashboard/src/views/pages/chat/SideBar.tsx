import ContactCard from "./ContactChat"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { auth, database } from "../../../configs/firebase"
import { useAuthState } from 'react-firebase-hooks/auth'

import { useCollection } from 'react-firebase-hooks/firestore'

import { collection, getDocs, orderBy, query } from "firebase/firestore"


const SideBar = () => {
  const [messages, setMessages] = useState<any[]>([])
  const [user] = useAuthState(auth)
  const [snapshot, loading, error] = useCollection(collection(database, 'chats'))

  const [showAddContact, setShowAddContact] = useState(false)
  const [showLogoutPop, setShowLogoutPop] = useState(false)

  const allChats = snapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  console.log(user)
  console.log(allChats)
  const chats = allChats


  const fetchData = async () => {
    try {
      const collectionRef = collection(database, "chats")
      const q = query(collectionRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      )
      console.log(querySnapshot)
      console.log(messages)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }


  useEffect(() => {

    fetchData()
  }, [])



  return (
    <aside className='bg-gray-700 relative rounded-lg flex flex-col h-full shadow-xl shadow-gray-800  w-full text-left text-lg text-white p-4'>
      <div className="flex  items-center justify-between border-b-2 border-dPri pb-3">
        {/*     Name And DP  ad Logout*/}
        <div className="flex items-center gap-x-4 justify-around ">
          {/*         IMG */}
          {/* <img src={user.photoURL} className="w-16 h-16 border-2 border-dPri rounded-full " /> */}
          {/*     Username */}
          <h1>{user?.displayName}</h1>
        </div>
        {/*     Logout */}
        <button onClick={() => setShowLogoutPop(true)} ><FontAwesomeIcon icon={faRightFromBracket} className='p-3 bg-dPri shadow-lg shadow-gray-800 rounded-lg hover:scale-105 transition-all hover:bg-lPri ' /> </button>

        {/*     Login Modal */}
        {/* <Modal showItem={showLogoutPop} setShowItem={setShowLogoutPop} >
          <Logout setShowItem={setShowLogoutPop} />
        </Modal> */}
      </div>
      {/* <Button onClick={() => setShowAddContact(true)} >New Chat</Button> */}
      {/*     Add Contact Pop Up */}
      {/* <Modal showItem={showAddContact} setShowItem={setShowAddContact} >
        <AddContact user={user} setShowItem={setShowAddContact} chats={chats} />
      </Modal> */}
      {/*     contacts */}
      <div className="w-full overflow-auto px-3 h-full  ">
        {chats?.map((chat, i) => {
          return (<ContactCard key={i} data={chat} email={chat.user._id} />)
        })}
      </div>




    </aside>
  )
}

export default SideBar
