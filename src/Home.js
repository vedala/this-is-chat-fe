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
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();




  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getAccessTokenSilently({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        });

        const url = new URL("messages", process.env.REACT_APP_CHAT_API_URL);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessages(response.data);
      } catch (e) {
        console.error("Error in fetching message, e=", e);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (!isAuthenticated || ws.current) return;

    let cancelled = false;

    async function connectWS() {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });

      if (cancelled) return;

      const wsUrl = `${process.env.REACT_APP_CHAT_API_URL.replace("http", "ws")}?token=${token}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        setMessages((prev) => [...prev, data.message]);
      };

      ws.current.onclose = (event) => {
        ws.current = null;
        if (event.code === 4002) {
          connectWS();
        }
      };
    }

    connectWS();

    return () => {
      cancelled = true;
      if (ws.current) ws.current.close();
      ws.current = null;
    }
  }, [isAuthenticated]);

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
      <div className="rooms-and-messages">
        <div className="room-list">
          <div>room-1</div>
          <div>room-2</div>
        </div>
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
    </div>
  );
}

export default withAuthenticationRequired(Home, {
  onRedirecting: () => <Loading />
});
