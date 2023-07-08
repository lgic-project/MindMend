import "@weavy/uikit-react/dist/css/weavy.css"
import React, { useEffect, useState } from "react"
import { WeavyClient, WeavyProvider, Chat } from "@weavy/uikit-react"

const weavyClient = new WeavyClient({
  url: "https://b8daaf7cd2ab4321bd5c0475599ffef1.weavy.io",
  tokenFactory: async () => "{ACCESS_TOKEN_FROM_STEP_2}",
})
const [accessTok, setAccessTok] = useState("")
useEffect(() => {
  const accessToken = async () => {
    let response = await fetch(
      "https://b8daaf7cd2ab4321bd5c0475599ffef1.weavy.io/api/users/demouser/tokens",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer wys_GS22QpnTws91ZyFj3lKVsVwm2Ym7t10j2zOA`,
        },
        body: JSON.stringify({ name: "Sapna", expires_in: 7200 }),
      }
    )

    if (response.ok) {
      let resp = await response.json()
      setAccessTok(resp.access_token)
      console.log(accessTok)
      // let accessToken = resp.access_token
    }
  }
})

function Message() {
  return (
    <div className="App">
      <WeavyProvider client={weavyClient}>
        <Chat uid="demochat" />
      </WeavyProvider>
    </div>
  )
}

export default Message
