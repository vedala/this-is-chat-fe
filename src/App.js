import './App.css';

function App() {
  function submitMessage(formData) {
    const inputMessage = formData.get("input-msg");
    console.log("submitMessage: ", inputMessage);
  }

  return (
    <div className="App">
      <header className="App-header">
        Welcome to This-Is-Chat
      </header>
      <form id="input-form" action={submitMessage}>
        <input id="input-msg" name="input-msg" autoComplete="off" />
        <button>Send</button>
      </form>
    </div>
  );
}

export default App;
