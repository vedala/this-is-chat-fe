import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);

  const listMessages = messages.map(message => <li>{message}</li>);

  async function saveMessageToDb(message) {
    await axios.post("http://localhost:4000/messages", {
        message
      },
      {
        headers: {
          "content-type": "application/json",
        }
      },
    );
  }

  async function submitMessage(formData) {
    const inputMessage = formData.get("input-msg");
    await saveMessageToDb(inputMessage);
    console.log("submitMessage: ", inputMessage);
    const newMessages = [...messages, inputMessage];
    setMessages(newMessages);
  }

  return (
    <div className="App">
      <header className="App-header">
        Welcome to This-Is-Chat
      </header>
      <div id="messages-window">
        <ul>{listMessages}</ul>
        <form id="input-form" action={submitMessage}>
          <input id="input-msg" name="input-msg" autoComplete="off" />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
