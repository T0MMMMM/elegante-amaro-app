import * as service from "../services/users.service.js";

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
