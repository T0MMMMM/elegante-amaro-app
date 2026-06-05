import Category from "../models/categories.model.js";

export const getAll = async () => Category.findAll();

export const getById = async (id) => Category.findByPk(id);

export const create = async (data) => Category.create(data);

export const update = async (id, data) => {
  const record = await Category.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await Category.findByPk(id);
  if (!record) return null;
  await record.destroy();
  return true;
};
