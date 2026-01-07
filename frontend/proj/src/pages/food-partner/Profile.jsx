import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/profile.css";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);

  // Click handler for videos
  const handleVideoClick = (index) => {
    navigate('/home', { 
      state: { 
        fromProfile: true,
        profileId: id,
        startIndex: index,
        profileVideos: videos 
      } 
    });
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
      {/* HEADER */}
      <section className="profile-header">
        <div className="profile-meta">
          <img
            className="profile-avatar"
            src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60"
            alt="Profile"
          />

          <div className="profile-info">
            <h1 className="profile-pill profile-business">
              {profile?.name}
            </h1>
            <p className="profile-pill profile-address">
              {profile?.address}
            </p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-label">total meals</span>
            <span className="profile-stat-value">
              {profile?.totalMeals ?? 0}
            </span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-label">customers served</span>
            <span className="profile-stat-value">
              {profile?.customersServed ?? 0}
            </span>
          </div>
        </div>
      </section>

      <hr className="profile-sep" />

      {/* VIDEOS GRID */}
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