import React, { useEffect, useState } from 'react';
import { fetchMessage } from './fetcher';
// import '../css/Home.css';

function Home() {
    const [message, setMessage] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const message = await fetchMessage();
          setMessage(message);
        } catch (error) {
          console.error("Error fetching message:", error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div className="Home">
        <h1>FastAPI React Integration</h1>
        <p>{message}</p>

        <footer>
        </footer>
      </div>
    );
  }
  
  export default Home;