import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);

  const listMessages = messages.map(row => <li key={row._id}>{row.message}</li>);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:4000/messages");
      setMessages(response.data);
    };

    fetchData();
  }, []);

  async function saveMessageToDb(message) {
    const response = await axios.post("http://localhost:4000/messages", {
        message
      },
      {
        headers: {
          "content-type": "application/json",
        }
      },
    );

    return response.data;
  }

  async function submitMessage(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const inputMessage = formData.get("input-msg");
    const dbId = await saveMessageToDb(inputMessage);
    const newMessages = [...messages, { _id: dbId, message: inputMessage}];
    setMessages(newMessages);
  }

  return (
    <div className="App">
      <header className="App-header">
        Welcome to This-Is-Chat
      </header>
      <div id="messages-window">
        <ul>{listMessages}</ul>
        <form id="input-form" onSubmit={submitMessage}>
          <input id="input-msg" name="input-msg" autoComplete="off" />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
