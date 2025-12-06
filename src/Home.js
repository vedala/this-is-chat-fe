import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Loading from './Loading';

function Home() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef(null);
  const ws = useRef(null);
  const { user, isAuthenticated } = useAuth0();




  useEffect(() => {
    async function fetchData() {
      const url = new URL("messages", process.env.REACT_APP_CHAT_API_URL);
      const response = await axios.get(url);
      setMessages(response.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(process.env.REACT_APP_CHAT_API_URL);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMessages((prev) => [...prev, data.message]);
    };

    return () => ws.current.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isAuthenticated) return null;
  const userId = user.sub;

  const listMessages = messages.map((row) => {
    const isMine = row.userId === userId;

    return (
      <div
        key={row._id}
        className={`message ${isMine ? "mine" : "theirs"}`}
      >
        {row.message}
      </div>
    );
  });

  async function submitMessage(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const inputMessage = formData.get("input-msg");

    if (!inputMessage.trim()) return;

    ws.current.send(
      JSON.stringify({
        text: inputMessage,
        userId: userId
      })
    );

    setInputValue("");
  }

  return (
    <div className="App">
      <header className="App-header">
        This-Is-Chat
      </header>
      <div className="messages-window">
        <div className="message-list">
          {listMessages}
          <div ref={bottomRef}></div>
        </div>
        <form className="input-form" onSubmit={submitMessage}>
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

export default withAuthenticationRequired(Home, {
  onRedirecting: () => <Loading />
});
