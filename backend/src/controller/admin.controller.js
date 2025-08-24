import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
	try {
		const result = await cloudinary.api.ping();
		console.log("✅ Cloudinary connection successful:", result);
		return true;
	} catch (error) {
		console.error("❌ Cloudinary connection failed:", error.message);
		return false;
	}
};

// Test connection on startup
testCloudinaryConnection();

// helper function for cloudinary uploads
const uploadToCloudinary = async (file) => {
	try {
		if (!file || !file.tempFilePath) {
			throw new Error("Invalid file object or missing temporary file path");
		}

		console.log("📤 Starting Cloudinary upload:", {
			fileName: file.name,
			fileSize: file.size,
			mimeType: file.mimetype,
			tempFilePath: file.tempFilePath
		});

		// Import fs using dynamic import
		const { existsSync, statSync } = await import('fs');
		
		// Check if temp file exists
		if (!existsSync(file.tempFilePath)) {
			throw new Error(`Temporary file not found: ${file.tempFilePath}`);
		}

		const fileStats = statSync(file.tempFilePath);
		if (fileStats.size === 0) {
			throw new Error("File is empty");
		}

		// Simple upload with minimal options to avoid signature issues
		const uploadOptions = {
			resource_type: "auto",
			folder: "spotify-clone",
			public_id: `${Date.now()}_${file.name?.replace(/[^a-zA-Z0-9]/g, '_')}`,
		};

		console.log("🚀 Uploading to Cloudinary...");
		const result = await cloudinary.uploader.upload(file.tempFilePath, uploadOptions);
		
		console.log("✅ Upload successful:", {
			public_id: result.public_id,
			url: result.secure_url
		});
		
		return result.secure_url;
	} catch (error) {
		console.error("❌ Cloudinary upload error:", {
			message: error.message,
			httpCode: error.http_code,
			errorCode: error.error?.code,
			fileName: file?.name
		});
		
		// Try a basic upload as fallback
		if (error.message.includes('Invalid Signature')) {
			console.log("♾️ Retrying with basic upload...");
			try {
				const basicResult = await cloudinary.uploader.upload(file.tempFilePath, {
					resource_type: "auto"
				});
				console.log("✅ Basic upload successful:", basicResult.secure_url);
				return basicResult.secure_url;
			} catch (retryError) {
				console.error("❌ Basic upload also failed:", retryError.message);
			}
		}
		
		throw new Error(`Upload failed: ${error.message}`);
	}
};

export const createSong = async (req, res, next) => {
	try {
		// Debug incoming request
		console.log("📈 CreateSong request:", {
			body: req.body,
			files: req.files ? Object.keys(req.files) : 'No files',
			contentType: req.headers['content-type']
		});

		if (!req.files || !req.files.audioFile || !req.files.imageFile) {
			console.error("❌ Missing files in request:", {
				files: req.files ? Object.keys(req.files) : 'No files object'
			});
			return res.status(400).json({ message: "Please upload all files" });
		}

		const { title, artist, albumId, duration } = req.body;

		// Validate required fields
		if (!title || !title.trim()) {
			return res.status(400).json({ message: "Song title is required" });
		}
		if (!artist || !artist.trim()) {
			return res.status(400).json({ message: "Artist name is required" });
		}
		if (!duration || isNaN(duration) || Number(duration) <= 0) {
			return res.status(400).json({ message: "Valid duration is required" });
		}
		const audioFile = req.files.audioFile;
		const imageFile = req.files.imageFile;

		const audioUrl = await uploadToCloudinary(audioFile);
		const imageUrl = await uploadToCloudinary(imageFile);

		const song = new Song({
			title,
			artist,
			audioUrl,
			imageUrl,
			duration,
			albumId: albumId || null,
		});

		await song.save();

		// if song belongs to an album, update the album's songs array
		if (albumId) {
			await Album.findByIdAndUpdate(albumId, {
				$push: { songs: song._id },
			});
		}
		res.status(201).json(song);
	} catch (error) {
		console.log("Error in createSong", error);
		next(error);
	}
};

export const deleteSong = async (req, res, next) => {
	try {
		const { id } = req.params;

		const song = await Song.findById(id);

		// if song belongs to an album, update the album's songs array
		if (song.albumId) {
			await Album.findByIdAndUpdate(song.albumId, {
				$pull: { songs: song._id },
			});
		}

		await Song.findByIdAndDelete(id);

		res.status(200).json({ message: "Song deleted successfully" });
	} catch (error) {
		console.log("Error in deleteSong", error);
		next(error);
	}
};

export const createAlbum = async (req, res, next) => {
	try {
		// Debug incoming request
		console.log("📈 CreateAlbum request:", {
			body: req.body,
			files: req.files ? Object.keys(req.files) : 'No files',
			contentType: req.headers['content-type']
		});

		if (!req.files || !req.files.imageFile) {
			console.error("❌ Missing image file in request:", {
				files: req.files ? Object.keys(req.files) : 'No files object'
			});
			return res.status(400).json({ message: "Please upload an image file" });
		}

		const { title, artist, releaseYear } = req.body;
		const { imageFile } = req.files;

		// Validate required fields
		if (!title || !title.trim()) {
			return res.status(400).json({ message: "Album title is required" });
		}
		if (!artist || !artist.trim()) {
			return res.status(400).json({ message: "Artist name is required" });
		}
		if (!releaseYear || isNaN(releaseYear) || Number(releaseYear) < 1900 || Number(releaseYear) > new Date().getFullYear()) {
			return res.status(400).json({ message: "Valid release year is required" });
		}

		const imageUrl = await uploadToCloudinary(imageFile);

		const album = new Album({
			title,
			artist,
			imageUrl,
			releaseYear,
		});

		await album.save();

		res.status(201).json(album);
	} catch (error) {
		console.log("Error in createAlbum", error);
		next(error);
	}
};

export const deleteAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;
		await Song.deleteMany({ albumId: id });
		await Album.findByIdAndDelete(id);
		res.status(200).json({ message: "Album deleted successfully" });
	} catch (error) {
		console.log("Error in deleteAlbum", error);
		next(error);
	}
};

export const checkAdmin = async (req, res, next) => {
	res.status(200).json({ admin: true });
};
