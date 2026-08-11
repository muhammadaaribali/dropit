import {useState} from "react";
import Send from "./pages/Send";
import Receive from "./pages/Receive";

function App(){

  const [activeTab, setActiveTab]= useState("Send");

  return(
    <div>
      <nav>
        <button onClick={() => setActiveTab("send")}>
        Send
        </button>

        <button onClick={()=> setActiveTab("Receive")}>
          Receive
        </button>
      </nav>

      <main>
        {activeTab === "send" ? <Send /> : <Receive />}
      </main>
    </div>
  );
}

export default App;