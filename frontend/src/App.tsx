import React, { useCallback, useRef, useState, useEffect } from 'react';
import './App.css';
import Webcam from 'react-webcam';
import { log } from 'console';

function App() {
  const [logged, setLogged] = useState<{name: string} | null>(null);
  const [login, setLogin] = useState('jakubkurzacz123');
  const [password, setPassword] = useState('zaq12wsx');
  const webcamRef = useRef<Webcam>(null);
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

    const data = {
      login: login,
      password: password,
      image: webcamRef.current?.getScreenshot()
    }

    const response = await fetch('http://127.0.0.1:5000//api/account', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Account details:', data);
      setLogged(data);
    } else {
      const errorMessage = await response.json();
      console.error('Error:', errorMessage.error);
      setMessage(errorMessage.error);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };
  
  return (
    <>
      <div className="background">
          <div className="shape"></div>
          <div className="shape"></div>
      </div>
      
      <div className='form'>
        {logged?
          <>
            <h1>Logged In:</h1>
            <div>
              Hello {logged.name}
              <button onClick={() => {setLogged(null)}}>Logout</button>
            </div>
          </>
          :
          <>
            <h2>Login Form</h2>
            <div>
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
              <div className='cam'>
                <Webcam
                  audio={false}
                  width={250}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              </div>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </>
        }
        {message && <p ref={messageRef}>{message}</p>}
      </div>
    </>
  );
}

export default App;
