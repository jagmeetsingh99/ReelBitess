// Profile.jsx - Add these changes
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Add useNavigate
import axios from "axios";
import "../../styles/profile.css";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Add this
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);

  // Add click handler
  const handleVideoClick = (index) => {
    // Navigate to main reels page with URL parameters
    navigate(`/reels?source=profile&profileId=${id}&start=${index}`);
  };

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:3000/api/food-partner/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems || []);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
      });
  }, [id]);

  return (
    <main className="profile-page">
      {/* HEADER - unchanged */}
      <section className="profile-header">
        {/* ... your existing header code ... */}
      </section>

      <hr className="profile-sep" />

      {/* VIDEOS GRID - Add onClick */}
      <section className="profile-grid">
        {videos.map((v, index) => (
          <div 
            key={v._id} 
            className="profile-grid-item"
            onClick={() => handleVideoClick(index)}
            style={{ cursor: 'pointer' }}
          >
            <video
              className="profile-grid-video"
              src={v.video}
              muted
              loop
              playsInline
            />
          </div>
        ))}
      </section>
    </main>
  );
};

export default Profile;