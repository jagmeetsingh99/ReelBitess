const cloudinary = require("../config/cloudinary");

class StorageService {

  uploadVideo(buffer) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "food-videos",
          format: "mp4",
          transformation: [
            { video_codec: "h264", audio_codec: "aac" }
          ],
        },
        (error, result) => {
          if (error) return reject(error);

          resolve({
            url: result.secure_url,
            fileId: result.public_id,
            thumbnailUrl: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/so_1/${result.public_id}.jpg`,
          });
        }
      ).end(buffer);
    });
  }

  async deleteVideo(fileId) {
    await cloudinary.uploader.destroy(fileId, {
      resource_type: "video",
    });
    return true;
  }
}

module.exports = new StorageService();
