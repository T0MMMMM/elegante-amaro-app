import CommandType from "../models/commands_types.model.js";

export const getAll = async () => CommandType.findAll();

export const getById = async (id) => CommandType.findByPk(id);

export const create = async (data) => CommandType.create(data);

export const update = async (id, data) => {
  const record = await CommandType.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await CommandType.findByPk(id);
  if (!record) return null;
  await record.destroy();
  return true;
};
