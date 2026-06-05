import StateCommand from "../models/state_commands.model.js";

export const getAll = async () => StateCommand.findAll();

export const getById = async (id) => StateCommand.findByPk(id);

export const create = async (data) => StateCommand.create(data);

export const update = async (id, data) => {
  const record = await StateCommand.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await StateCommand.findByPk(id);
  if (!record) return null;
  await record.destroy();
  return true;
};
