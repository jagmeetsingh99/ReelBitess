import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import api from '../../utils/api'

const Saved = () => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSavedVideos()
    }, [])

    const fetchSavedVideos = async () => {
        try {
            setLoading(true)
            const response = await api.get("/api/food/save", { 
                withCredentials: true 
            })
            
            console.log("Saved API Response:", response.data) // Debug log
            
            // Process based on your backend response structure
            if (response.data.savedFoods) {
                // If response has savedFoods array
                const savedFoods = response.data.savedFoods
                    .map(item => item.food) // Extract food object
                    .filter(food => food && food.video) // Filter valid items
                    .map(food => ({
                        _id: food._id,
                        video: food.video,
                        description: food.description || 'No description',
                        likeCount: food.likeCount || 0,
                        savesCount: food.savesCount || 0,
                        foodPartner: food.foodPartner,
                    }))
                
                setVideos(savedFoods)
            } else if (response.data.videos) {
                // If response has videos array directly
                setVideos(response.data.videos)
            } else {
                // If response structure is different
                console.warn("Unexpected response structure:", response.data)
            }
            
            setLoading(false)
        } catch (error) {
            console.error("Error fetching saved videos:", error.response?.data || error.message)
            setLoading(false)
            
            // Show error message to user
            if (error.response?.status === 404) {
                console.error("⚠️ Backend endpoint /api/food/save (GET) not found!")
                console.error("Please add this route to your backend:")
                console.error("router.get('/save', authUserMiddleware, getSaveFood)")
            }
        }
    }

    const removeSaved = async (item) => {
        try {
            await api.post(
                "/api/food/save", 
                { foodId: item._id }, 
                { withCredentials: true }
            )
            
            // Remove from UI immediately
            setVideos(prev => prev.filter(v => v._id !== item._id))
            
            // Optional: Show success message
            console.log("Video removed from saved")
        } catch (error) {
            console.error("Error removing saved:", error.response?.data || error.message)
        }
    }

    const handleLike = async (item) => {
        try {
            const res = await api.post(
                "/api/food/like",
                { foodId: item._id },
                { withCredentials: true }
            )
            
            // Update like count in UI
            setVideos(prev =>
                prev.map(v =>
                    v._id === item._id
                        ? { 
                            ...v, 
                            likeCount: res.data.like ? v.likeCount + 1 : Math.max(0, v.likeCount - 1) 
                          }
                        : v
                )
            )
        } catch (error) {
            console.error("Like error:", error.response?.data || error.message)
        }
    }

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                background: 'black',
                fontSize: '18px'
            }}>
                📥 Loading saved videos...
            </div>
        )
    }

    if (videos.length === 0) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                background: 'black',
                textAlign: 'center',
                padding: '20px'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📁</div>
                <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>No saved videos yet</h2>
                <p style={{ color: '#aaa', maxWidth: '300px' }}>
                    Videos you save will appear here. Start saving your favorite food videos!
                </p>
            </div>
        )
    }

    return (
        <ReelFeed
            items={videos}
            onLike={handleLike}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
        />
    )
}

export default Saved