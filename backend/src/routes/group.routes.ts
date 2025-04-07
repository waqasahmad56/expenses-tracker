import express from "express";
import {  getGroupsController } from "../controllers/group.controller";
import {createGroupController} from "../controllers/group.controller";
import { updateGroupUsersController } from "../controllers/group.controller";

const router = express.Router();

router.post("/create", createGroupController);
router.get("/get", getGroupsController);
router.patch("/:groupId/users", updateGroupUsersController);


export default router;




