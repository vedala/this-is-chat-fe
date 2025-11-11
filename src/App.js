import { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);

  const listMessages = messages.map(message => <li>{message}</li>)
  function submitMessage(formData) {
    const inputMessage = formData.get("input-msg");
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
