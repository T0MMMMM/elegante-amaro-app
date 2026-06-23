import * as service from "../services/state_commands.service.js";

export const getAll = async (req, res) => {
  try {
    const includeDeleted = req.query.includeDeleted === "true";
    res.status(200).json(await service.getAll(includeDeleted));
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getById = async (req, res) => {
  try {
    const record = await service.getById(req.params.id);
    if (!record) return res.status(404).json({ message: "StateCommand not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const create = async (req, res) => {
  try {
    res.status(201).json(await service.create(req.body));
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const update = async (req, res) => {
  try {
    const record = await service.update(req.params.id, req.body);
    if (!record) return res.status(404).json({ message: "StateCommand not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const remove = async (req, res) => {
  try {
    const result = await service.remove(req.params.id);
    if (!result) return res.status(404).json({ message: "StateCommand not found" });
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Internal server error" });
  }
};
