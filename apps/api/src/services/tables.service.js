import Table from "../models/tables.model.js";

export const getAll = async () => Table.findAll();

export const getById = async (id) => Table.findByPk(id);

export const create = async (data) => Table.create(data);

export const update = async (id, data) => {
  const record = await Table.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await Table.findByPk(id);
  if (!record) return null;
  await record.destroy();
  return true;
};
