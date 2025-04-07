import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hhgrfewfdfghgfdb';


export const addUser = async (userData: Omit<IUser, 'id'>) => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser.toObject();
};

export const login = async ({ email, password }: { email: string; password: string }) => {
  console.log("Login Attempt:", email);

  const user = await User.findOne({ email });

  if (!user) {
    console.log(" User Not Found");
    return null;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log(" Incorrect Password");
    return null;
  }

  console.log(" User Authenticated Successfully");
  const userId = user._id instanceof Object ? user._id.toString() : user._id;

  const token = jwt.sign({ id: userId, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  return {
    user: {
      _id: userId,
      name: user.name,
      email: user.email,
    } as IUser,
    token,
  };
};

export const getAllUsers = async () => {
  return await User.find();
};

export const logoutUser = () => {
  return { message: "Logged out successfully!" };
};
