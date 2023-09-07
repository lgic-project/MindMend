import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const ChatEngine = dynamic(() =>
  import("react-chat-engine").then((module) => module.ChatEngine)
)

const MessageFormSocial = dynamic(() =>
  import("react-chat-engine").then((module) => module.MessageFormSocial)
)

export default function Chats() {
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    setShowChat(true)
  }, [])

  if (!showChat) return <div />

  return (
    <div className="background">
      <div className="shadow" style={{ borderRadius: 4 }} >
        <ChatEngine
          height="calc(80vh)"
          projectID="mindmend-58c20"
          userName="hello"
          userSecret="Simran"
          renderNewMessageForm={() => <MessageFormSocial />}
        />
      </div>
    </div>
  )
}
