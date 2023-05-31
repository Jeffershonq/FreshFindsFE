import multer from "multer";
import pkg from 'multer-gridfs-storage';
const {GridFsStorage} = pkg;
import mongoose from "mongoose";

// Create storage engine

const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/FreshFinds',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: "uploads",
      filename: file.originalname,
    };
  },
});

// Create multer middleware
const uploadImage = multer({ storage });

// Check if the "uploads" bucket exists, and create it if not
const conn = mongoose.createConnection('mongodb://localhost:27017/FreshFinds', { useNewUrlParser: true, useUnifiedTopology: true });
conn.once('open', () => {
  conn.db.listCollections({ name: 'uploads' })
    .next((err, collinfo) => {
      if (!collinfo) {
        conn.db.createCollection('uploads');
      }
    });
});

export { storage, uploadImage };
