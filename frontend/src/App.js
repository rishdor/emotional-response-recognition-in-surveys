import './App.css';
import React, { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch("http://localhost:8000/");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setMessage(data.message); 
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };

    fetchMessage();
  }, []); 

  return (
    <div className="App">
      <h1>FastAPI React Integration</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
