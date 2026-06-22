import User from "../models/users.model.js";

export const getAllUsers = async () => User.findAll();

export const getUserById = async (id) => User.findByPk(id);

export const createUser = async (data) => User.create(data);

export const updateUser = async (id, data) => {
  const record = await User.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const removeUser = async (id) => {
  const record = await User.findByPk(id);
  if (!record) return null;
  await record.destroy();
  return true;
};
