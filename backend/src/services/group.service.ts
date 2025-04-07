import Group from "../models/group.model";
import User from "../models/user.model";

export const createGroup = async (name: string, users: string[]) => {
  const group = new Group({ name, users });
  await group.save();

  await User.updateMany(
    { _id: { $in: users } },
    { $addToSet: { groups: group._id } }
  );

  return group;
};

export const getGroups = async () => {
  return await Group.find().populate("users", "name email");
};
