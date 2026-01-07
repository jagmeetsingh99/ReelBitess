// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import ReelFeed from "../../components/ReelFeed";

// const Home = () => {
//   const location = useLocation();
//   const [videos, setVideos] = useState([]);
//   const [startIndex, setStartIndex] = useState(0);

//   // Check if coming from profile
//   const { fromProfile, profileVideos, startIndex: profileStartIndex } = location.state || {};

//   useEffect(() => {
//     if (fromProfile && profileVideos && profileVideos.length > 0) {
//       // Coming from Profile page
//       let videosToShow = profileVideos;
      
//       // Reorder: clicked video first
//       if (profileStartIndex > 0 && profileStartIndex < profileVideos.length) {
//         videosToShow = [
//           ...profileVideos.slice(profileStartIndex),
//           ...profileVideos.slice(0, profileStartIndex)
//         ];
//         setStartIndex(0); // First video is now the clicked one
//       } else {
//         setStartIndex(profileStartIndex || 0);
//       }
      
//       setVideos(videosToShow);
//     } else {
//       // Normal home page - fetch all videos
//       axios
//         .get("http://localhost:3000/api/food", { withCredentials: true })
//         .then((res) => {
//           res.data.foodItems.forEach((item, i) => {
//             console.log(`VIDEO ${i}:`, item.video);
//           });

//           // Filter only Cloudinary URLs
//           const cleanVideos = res.data.foodItems.filter(
//             (item) =>
//               item.video &&
//               item.video.startsWith("https://res.cloudinary.com")
//           );

//           setVideos(cleanVideos);
//           setStartIndex(0);
//         })
//         .catch((err) => {
//           console.error("Fetch food error:", err);
//         });
//     }
//   }, [fromProfile, profileVideos, profileStartIndex]);

//   const likeVideo = async (item) => {
//     const res = await axios.post(
//       "http://localhost:3000/api/food/like",
//       { foodId: item._id },
//       { withCredentials: true }
//     );

//     setVideos((prev) =>
//       prev.map((v) =>
//         v._id === item._id
//           ? { ...v, likeCount: v.likeCount + (res.data.like ? 1 : -1) }
//           : v
//       )
//     );
//   };

//   const saveVideo = async (item) => {
//     const res = await axios.post(
//       "http://localhost:3000/api/food/save",
//       { foodId: item._id },
//       { withCredentials: true }
//     );

//     setVideos((prev) =>
//       prev.map((v) =>
//         v._id === item._id
//           ? { ...v, savesCount: v.savesCount + (res.data.save ? 1 : -1) }
//           : v
//       )
//     );
//   };

//   // Reorder videos if startIndex > 0
//   const reorderedVideos = startIndex > 0 && videos.length > 0
//     ? [...videos.slice(startIndex), ...videos.slice(0, startIndex)]
//     : videos;

//   return (
//     <ReelFeed
//       items={reorderedVideos}
//       onLike={likeVideo}
//       onSave={saveVideo}
//       emptyMessage="No videos available"
//     />
//   );
// };

// export default Home;
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ReelFeed from "../../components/ReelFeed";

const Home = () => {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [currentProfileId, setCurrentProfileId] = useState(null);

  // Check if coming from profile
  const { fromProfile, profileId, profileVideos, startIndex: profileStartIndex } = location.state || {};

  useEffect(() => {
    if (fromProfile && profileVideos && profileVideos.length > 0) {
      // Coming from Profile page
      setCurrentProfileId(profileId);
      
      let videosToShow = profileVideos;
      
      // Reorder: clicked video first
      if (profileStartIndex > 0 && profileStartIndex < profileVideos.length) {
        videosToShow = [
          ...profileVideos.slice(profileStartIndex),
          ...profileVideos.slice(0, profileStartIndex)
        ];
        setStartIndex(0);
      } else {
        setStartIndex(profileStartIndex || 0);
      }
      
      setVideos(videosToShow);
    } else {
      // Normal home page - fetch all videos
      setCurrentProfileId(null);
      
      axios
        .get("http://reelbitess.onrender.com/api/food", { withCredentials: true })
        .then((res) => {
          // Filter only Cloudinary URLs
          const cleanVideos = res.data.foodItems.filter(
            (item) =>
              item.video &&
              item.video.startsWith("https://res.cloudinary.com")
          );

          setVideos(cleanVideos);
          setStartIndex(0);
        })
        .catch((err) => {
          console.error("Fetch food error:", err);
        });
    }
  }, [fromProfile, profileId, profileVideos, profileStartIndex]);

  // ✅ FIXED: Like function - works with updated backend
  const likeVideo = async (item) => {
    try {
      const res = await axios.post(
        "http://reelbitess.onrender.com/api/food/like",
        { foodId: item._id },
        { withCredentials: true }
      );

      console.log("Like response:", res.data); // Debug log

      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? { 
                ...v, 
                likeCount: res.data.like ? v.likeCount + 1 : Math.max(0, v.likeCount - 1) 
              }
            : v
        )
      );
    } catch (err) {
      console.error("Like error:", err.response?.data || err.message);
    }
  };

  // ✅ FIXED: Save function - works with updated backend
  const saveVideo = async (item) => {
    try {
      const res = await axios.post(
        "http://reelbitess.onrender.com/api/food/save",
        { foodId: item._id },
        { withCredentials: true }
      );

      console.log("Save response:", res.data); // Debug log

      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? { 
                ...v, 
                savesCount: res.data.save ? v.savesCount + 1 : Math.max(0, v.savesCount - 1) 
              }
            : v
        )
      );
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
    }
  };

  // Reorder videos if startIndex > 0
  const reorderedVideos = startIndex > 0 && videos.length > 0
    ? [...videos.slice(startIndex), ...videos.slice(0, startIndex)]
    : videos;

  return (
    <ReelFeed
      items={reorderedVideos}
      onLike={likeVideo}
      onSave={saveVideo}
      emptyMessage="No videos available"
      currentProfileId={currentProfileId}
    />
  );
};

export default Home;