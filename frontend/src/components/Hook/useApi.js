// hooks/useApi.js
import { useEffect, useState } from "react";
import axios from "axios";

const useApi = (url, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setData(res.data.data || res.data);
      setError(null);
    } catch (err) {
      setError(err);
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};

export default useApi;
