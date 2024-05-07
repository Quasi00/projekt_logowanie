import React, { useCallback, useRef, useState, useEffect } from 'react';
import './App.css';
import Webcam from 'react-webcam';

function App() {
  const [login, setLogin] = useState('jakubkurzacz123');
  const [password, setPassword] = useState('zaq12wsx');
  const [image, setImage] = useState('');
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
      image: image
    }

    console.log(data)

    const response = await fetch('http://127.0.0.1:5000//api/account', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
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

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
      setImage(imageSrc);
    }
  }, [webcamRef]);

  return (
    <>
      <div className="background">
          <div className="shape"></div>
          <div className="shape"></div>
      </div>
      
      <div className='form'>
        <div>
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
          {isCaptureEnable || (
            <button onClick={() => setCaptureEnable(true)}>start</button>
          )}
          {isCaptureEnable && (
            <>
              <div>
                <button onClick={() => setCaptureEnable(false)}>end </button>
              </div>
              <div>
                <Webcam
                  audio={false}
                  width={540}
                  height={360}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              </div>
              <button onClick={capture} type='button'>capture</button>
            </>
          )}
          {url && (
            <>
              <div>
                <button
                  onClick={() => {
                    setUrl(null);
                  }}
                >
                  delete
                </button>
              </div>
              <div>
                <img src={url} alt="Screenshot" />
              </div>
            </>
          )}
          </div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        {message && <p>{message}</p>}
      </div>
    </>
  );
}

export default App;
