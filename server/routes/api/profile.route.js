import { Router } from "express";
import isLoggedIn from "../../middlewares/isLoggedIn";
import ProfileController from "../../controllers/profile.controller";

const router = Router();

router.get("/", ProfileController.getProfiles);
router.get("/:user_id", ProfileController.getSpecificProfile);
router.get("/me", isLoggedIn, ProfileController.getCurrentProfile);
router.post("/", isLoggedIn, ProfileController.updateProfile);
router.delete("/", isLoggedIn, ProfileController.removeProfile);

export default router;
