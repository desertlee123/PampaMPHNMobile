// assets/src/screens/Shorts.js
import { useEffect, useState } from "react";
import ShortsComponent from "../components/shorts/ShortsComponent";
import { API_BASE_URL } from "../services/Api"

export default function Shorts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadVideos = async () => {
      const res = await fetch(`${API_BASE_URL}/videos`);
      const data = await res.json();

      const mappedVideos = data.map(v => ({
        id: v.id.toString(),
        url: v.youtube_url
      }));

      setItems(mappedVideos);
    }

    loadVideos();
  }, []);

  return <ShortsComponent items={items} />;
}
