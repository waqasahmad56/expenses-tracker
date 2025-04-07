import { Request, Response, NextFunction } from "express";
import { createGroup, getGroups } from "../services/group.service";
import mongoose from 'mongoose';
import  Group  from '../models/group.model';


export const createGroupController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, users } = req.body;

      if (!name || !users || users.length === 0) {
        res.status(400).json({ message: "Invalid data" });
        return;
      }

      const group = await createGroup(name, users);
      res.status(201).json(group);
    } catch (error) {
      next(error);
    }
  };

export const getGroupsController = async (req: Request, res: Response) => {
  try {
    const groups = await getGroups();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
};



export const updateGroupUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { groupId } = req.params;
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      res.status(400).json({ message: "Users must be a non-empty array" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      res.status(400).json({ message: "Invalid groupId" });
      return;
    }

    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    const existingUserIds = group.users.map((id) => id.toString());
    const newUserIds = users.map((id) => id.toString());

    const mergedUsers = Array.from(new Set([...existingUserIds, ...newUserIds]));

    group.users = mergedUsers.map((id) => id.toString()) as unknown as string[];
    await group.save();

    res.status(200).json({ message: "Users updated successfully", group });
  } catch (error) {
    next(error);
  }
};

