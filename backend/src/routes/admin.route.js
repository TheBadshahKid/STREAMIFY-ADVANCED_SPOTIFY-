import { Router } from "express";
import { checkAdmin, createAlbum, createSong, deleteAlbum, deleteSong } from "../controller/admin.controller.js";
import { getAllSongs } from "../controller/song.controller.js";
import { getAllAlbums } from "../controller/album.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute, requireAdmin);

router.get("/check", checkAdmin);

router.get("/songs", getAllSongs);
router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

router.get("/albums", getAllAlbums);
router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

export default router;
