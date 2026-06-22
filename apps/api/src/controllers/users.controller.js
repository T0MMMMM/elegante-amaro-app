import { getAllUsers, getUserById, createUser, updateUser, removeUser } from "../services/users.service.js";

export const getUsers = async (req, res) => {
  try {
    res.status(200).json(await service.getAllUsers());
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const create = async (req, res) => {
  try {
    res.status(201).json(await service.createUser(req.body));
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const update = async (req, res) => {
  try {
    const record = await service.updateUser(req.params.id, req.body);
    if (!record) return res.status(404).json({ message: "User not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const remove = async (req, res) => {
  try {
    const result = await service.removeUser(req.params.id);
    if (!result) return res.status(404).json({ message: "User not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const createUserHandler = async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
};

export const updateUserHandler = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
};

export const deleteUserHandler = async (req, res) => {
  try {
    const result = await removeUser(req.params.id);

    if (!result) return res.status(404).json({ message: "User not found" });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
};