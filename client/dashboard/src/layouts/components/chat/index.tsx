import { App as SendbirdApp } from "sendbird-uikit"
import "sendbird-uikit/dist/index.css"

function ChatUI() {


  const APP_ID = '2E957B7F-90E6-4E7F-90E3-B970D5C6BB6E'
  const USER_ID = 'sendbird_desk_agent_id_879580fb-623a-4f74-9e31-91ea5a50cd9a'



  return (
    <div className="App">
      <SendbirdApp appId={APP_ID} userId={USER_ID} />
    </div>
  )
}

export default ChatUI
