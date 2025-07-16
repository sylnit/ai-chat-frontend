
import React, { useState } from 'react';
import './loader.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/v1/'+input, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(res.body);
      const data = await res.json();
      
      const botMessage = { sender: 'bot', text: data.response || 'No response' };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error: ' + err.message }]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff7f0'
    }}>
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              marginBottom: '0.75rem'
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                backgroundColor: msg.sender === 'user' ? '#fb923c' : '#ffe0cc',
                color: msg.sender === 'user' ? '#fff' : '#333',
                maxWidth: '70%',
                wordWrap: 'break-word'
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="loader" />
          </div>
        )}
      </div>
      <div style={{
        borderTop: '1px solid #eee',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff'
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          style={{
            flex: 1,
            resize: 'none',
            border: '1px solid #ccc',
            borderRadius: '1rem',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            outline: 'none',
            marginRight: '0.5rem'
          }}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            backgroundColor: '#fb923c',
            color: '#fff',
            border: 'none',
            borderRadius: '1rem',
            padding: '0.5rem 1rem',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
