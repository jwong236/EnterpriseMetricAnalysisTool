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
    <b>
    { response ? response.message : "" }
    </b>
  )