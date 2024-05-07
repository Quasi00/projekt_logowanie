import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [login, setLogin] = useState('jakubkurzacz123');
  const [password, setPassword] = useState('zaq12wsx');
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setMessage('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('login', login);
    formData.append('password', password);
    if (image) {
      formData.append('image', image);
    }

    const response = await fetch('http://127.0.0.1:5000//api/account', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Account details:', data);
      setMessage('');
    } else {
      const errorMessage = await response.json();
      console.error('Error:', errorMessage.message);
      setMessage(errorMessage.message);
    }
  };

  return (
    <>
      <div className="background">
          <div className="shape"></div>
          <div className="shape"></div>
      </div>
      
      <div>
        <form onSubmit={handleSubmit}>
        <h2>Login Form</h2>
          <div>
            <label>Login:</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                if (file) {
                  setImage(file);
                }
              }}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        {message && <p ref={messageRef}>{message}</p>}
      </div>
    </>
  );
}

export default App;
