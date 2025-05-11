import { useEffect, useState } from "react";
import axios from "axios";

export default function useFetchAssets() {
  const [assets, setAssets] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/assets");
        setAssets(response.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchAssets();
  }, []);

  return { assets, error };
}
