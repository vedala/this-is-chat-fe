import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Loading from './Loading';

function Home() {
  const [messages, setMessages] = useState([]);
  const [rooms,    setRooms]    = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [roomNameInput, setRoomNameInput] = useState("");
  const [activeRoom, setActiveRoom] = useState("");
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
        const response = await axios.get(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            room: activeRoom
          }
        });

        setMessages(response.data);
      } catch (e) {
        console.error("Error in fetching messages, e=", e);
      }
    };

    if (isAuthenticated) fetchData();
  }, [activeRoom, isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getAccessTokenSilently({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        });

        const url = new URL("rooms", process.env.REACT_APP_CHAT_API_URL);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRooms(response.data);
        setActiveRoom(response.data[0].name);
      } catch (e) {
        console.error("Error in fetching rooms, e=", e);
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

  const listOfRooms = rooms.map((room) => {
    return (
      <div
        key={room._id}
        className={activeRoom === room.name ? "room active" : "room"}
        onClick={() => roomClicked(room.name)}
      >
        {room.name}
      </div>
    )
  });

  function roomClicked(roomName) {
    setActiveRoom(roomName);
  }

  async function createRoom(event) {
    event.preventDefault();
    if (!roomNameInput.trim()) return;

    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });

      const url = new URL("rooms", process.env.REACT_APP_CHAT_API_URL);
      await axios.post(url.toString(), {
        name: roomNameInput.trim()
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh rooms list
      const roomsResponse = await axios.get(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRooms(roomsResponse.data);
      setActiveRoom(roomNameInput.trim());
      setRoomNameInput("");
    } catch (e) {
      console.error("Error in creating room, e=", e);
    }
  }

  async function submitMessage(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const inputMessage = formData.get("input-msg");

    if (!inputMessage.trim()) return;

    ws.current.send(
      JSON.stringify({
        text: inputMessage,
        userId: userId,
        room: activeRoom
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
        <div className="rooms-panel">
          <div className="room-list">
            {listOfRooms}
          </div>
          <form className="create-room-form" onSubmit={createRoom}>
            <input
              type="text"
              placeholder="Room name"
              value={roomNameInput}
              onChange={(e) => setRoomNameInput(e.target.value)}
              autoComplete="off"
            />
            <button className="create-room-button" type="submit">
              Create New Room
            </button>
          </form>
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
