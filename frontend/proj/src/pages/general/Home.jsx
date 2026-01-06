import React, { useEffect, useState } from "react";
import axios from "axios";
import ReelFeed from "../../components/ReelFeed";

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((res) => {
         res.data.foodItems.forEach((item, i) => {
        console.log(`VIDEO ${i}:`, item.video);
      });

        // 🔥 HARD FILTER: sirf Cloudinary URLs allow
        const cleanVideos = res.data.foodItems.filter(
          (item) =>
            item.video &&
            item.video.startsWith("https://res.cloudinary.com")
        );

        setVideos(cleanVideos);
      })
      .catch((err) => {
        console.error("Fetch food error:", err);
      });
  }, []);

  const likeVideo = async (item) => {
    const res = await axios.post(
      "http://localhost:3000/api/food/like",
      { foodId: item._id },
      { withCredentials: true }
    );

    setVideos((prev) =>
      prev.map((v) =>
        v._id === item._id
          ? { ...v, likeCount: v.likeCount + (res.data.like ? 1 : -1) }
          : v
      )
    );
  };

  const saveVideo = async (item) => {
    const res = await axios.post(
      "http://localhost:3000/api/food/save",
      { foodId: item._id },
      { withCredentials: true }
    );

    setVideos((prev) =>
      prev.map((v) =>
        v._id === item._id
          ? { ...v, savesCount: v.savesCount + (res.data.save ? 1 : -1) }
          : v
      )
    );
  };

  return (
    <ReelFeed
      items={videos}
      onLike={likeVideo}
      onSave={saveVideo}
      emptyMessage="No videos available"
    />
  );
};

export default Home;
