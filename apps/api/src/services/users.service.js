import User from "../models/users.model.js";

export const getAllUsers = async (includeDeleted = false) => {
  try {
    const users = await User.findAll({ where: includeDeleted ? {} : { deleted_at: null } });
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
    if (!user || user.deleted_at) return null;

    // Soft delete: on conserve l'utilisateur en base pour préserver
    // les jointures avec l'historique des commandes.
    await user.update({ deleted_at: new Date() });

    return true;
  } catch (error) {
    throw new Error("Error deleting user");
  }
};
