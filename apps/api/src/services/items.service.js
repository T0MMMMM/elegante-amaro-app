import Item from "../models/items.model.js";
import Category from "../models/categories.model.js";

export const getAll = async () => Item.findAll({ include: [{ model: Category, attributes: ["id", "name"] }] });

export const getById = async (id) => Item.findByPk(id, { include: [{ model: Category, attributes: ["id", "name"] }] });

export const create = async (data) => Item.create(data);

export const update = async (id, data) => {
  const record = await Item.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await Item.findByPk(id);
  if (!record) return null;
  await record.destroy();
  return true;
};
