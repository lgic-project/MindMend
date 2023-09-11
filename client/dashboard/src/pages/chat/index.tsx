import React, { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import { auth, database } from "../../configs/firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { ChartBox } from "mdi-material-ui"
import SideBar from "src/views/pages/chat/ChatBox"


const ChatEngine = dynamic(() =>
  import("react-chat-engine").then((module) => module.ChatEngine)
)

const MessageFormSocial = dynamic(() =>
  import("react-chat-engine").then((module) => module.MessageFormSocial)
)


export default function Chats() {
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<any[]>([])


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
    setShowChat(true)
  }, [])

  if (!showChat) return <div />

  return (

    <main className='w-full font-disp h-screen flex justify-between gap-x-4 p-2 lg:p-4 iems-center bg-gradient-to-br from-mSec  to-dSec '>
      {/*         Side Bar */}
      <div className=' lg:w-4/12'>
        <SideBar />
      </div>
      {/*         Chat Box */}
      <ChartBox />



    </main>


  )
}
