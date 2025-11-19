import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const ws = useRef(null);

  const listMessages = messages.map(row => <li key={row._id}>{row.message}</li>);

  useEffect(() => {
    ws.current = new WebSocket(process.env.REACT_APP_CHAT_API_URL);

    // async function fetchData() {
    //   const url = new URL("messages", process.env.REACT_APP_CHAT_API_URL);
    //   const response = await axios.get(url);
    //   setMessages(response.data);
    // };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMessages((prev) => [...prev, data.message]);
    };

    // fetchData();

    return () => ws.current.close();
  }, []);

  // async function saveMessageToDb(message) {
  //   const url = new URL("messages", process.env.REACT_APP_CHAT_API_URL);
  //   const response = await axios.post(url, {
  //       message
  //     },
  //     {
  //       headers: {
  //         "content-type": "application/json",
  //       }
  //     },
  //   );

  //   return response.data;
  // }

  async function submitMessage(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const inputMessage = formData.get("input-msg");
    // const dbId = await saveMessageToDb(inputMessage);
    // const newMessages = [...messages, { _id: dbId, message: inputMessage}];
    // setMessages(newMessages);

    if (!inputMessage.trim()) return;

    ws.current.send(
      JSON.stringify({
        text: inputMessage
      })
    );

    setInputValue("");
  }

  return (
    <div className="App">
      <header className="App-header">
        Welcome to This-Is-Chat
      </header>
      <div id="messages-window">
        <ul>{listMessages}</ul>
        <form id="input-form" onSubmit={submitMessage}>
          <input
            id="input-msg"
            name="input-msg"
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
