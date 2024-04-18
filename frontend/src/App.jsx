import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // Try to fetch backend flask
  const [response, setResponse] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:5000");
      const resJson = await res.json()
      console.log(resJson);
      setResponse(resJson);
    }
    
    fetchData(); 
    
    return;
  }, [])
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <b>
        { response ? response.message : "" }
      </b>
    </>
  )
}

export default App
