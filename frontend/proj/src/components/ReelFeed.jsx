// ReelsPage.jsx - MODIFY THIS FILE
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Remove useParams
import ReelFeed from "./ReelFeed";
import axios from "axios";

const ReelsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse ALL parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source"); // "profile" or null
  const profileId = queryParams.get("profileId");
  const startIndex = parseInt(queryParams.get("start")) || 0;
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    if (source === "profile" && profileId) {
      // CASE 1: Coming from Profile page
      // Fetch videos from specific profile
      axios.get(`http://localhost:3000/api/food-partner/${profileId}`, {
        withCredentials: true,
      })
      .then((response) => {
        const profileVideos = response.data.foodPartner.foodItems || [];
        
        // Reorder videos: clicked video first
        let reorderedVideos = profileVideos;
        if (startIndex > 0 && startIndex < profileVideos.length) {
          reorderedVideos = [
            ...profileVideos.slice(startIndex),
            ...profileVideos.slice(0, startIndex)
          ];
        }
        
        setVideos(reorderedVideos);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile videos:", err);
        setLoading(false);
      });
      
    } else {
      // CASE 2: Normal reels feed (after login)
      // Fetch ALL videos (your existing logic here)
      axios.get("http://localhost:3000/api/all-reels", { // Adjust endpoint
        withCredentials: true,
      })
      .then((response) => {
        setVideos(response.data.videos || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching all reels:", err);
        setLoading(false);
      });
    }
  }, [source, profileId, startIndex]);

  // Handle like/save (keep your existing logic)
  const handleLike = (item) => {
    console.log("Like:", item);
    // Your like API call
  };

  const handleSave = (item) => {
    console.log("Save:", item);
    // Your save API call
  };

  // Handle back navigation
  const handleBack = () => {
    if (source === "profile" && profileId) {
      // Going back to profile
      navigate(`/food-partner/${profileId}`);
    } else {
      // Going back to previous page
      navigate(-1);
    }
  };

  if (loading) return <div>Loading reels...</div>;

  return (
    <div>
      {/* Back button - shows context-aware text */}
      <button 
        onClick={handleBack}
        style={{ 
          position: 'fixed', 
          top: 20, 
          left: 20, 
          zIndex: 1000,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {source === "profile" ? "← Back to Profile" : "← Back"}
      </button>
      
      <ReelFeed 
        items={videos}
        onLike={handleLike}
        onSave={handleSave}
        emptyMessage="No videos available"
      />
    </div>
  );
};

export default ReelsPage;