import { Request, Response } from 'express';
import * as userService from '../services/auth.service';
import { getAllUsers } from '../services/auth.service';
import { login } from '../services/auth.service';
import bcrypt from 'bcrypt';
import { logoutUser } from "../services/auth.service";

export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.addUser({ name, email, password:hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error adding user' });
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await login({ email, password });

    if (!result) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.cookie("token", result.token, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};


export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");

  const response = logoutUser();

  res.json(response);
};
