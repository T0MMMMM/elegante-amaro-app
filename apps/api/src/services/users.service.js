import User from "../models/users.model.js";

export const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new Error("Error fetching users");
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw new Error("Error fetching user");
  }
};

export const createUser = async (data) => {
  try {
    return await User.create(data);
  } catch (error) {
    throw new Error("Error creating user");
  }
};

export const updateUser = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(data);
  } catch (error) {
    throw new Error("Error updating user");
  }
};

export const removeUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return true;
  } catch (error) {
    throw new Error("Error deleting user");
  }
};