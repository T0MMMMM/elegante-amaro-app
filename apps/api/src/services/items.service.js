import Item from "../models/items.model.js";
import Category from "../models/categories.model.js";

export const getAll = async (includeDeleted = false) =>
  Item.findAll({
    where: includeDeleted ? {} : { deleted_at: null },
    include: [{ model: Category, attributes: ["id", "name"] }]
  });

export const getById = async (id) => Item.findByPk(id, { include: [{ model: Category, attributes: ["id", "name"] }] });

export const create = async (data) => Item.create(data);

export const update = async (id, data) => {
  const record = await Item.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await Item.findByPk(id);
  if (!record || record.deleted_at) return null;

  // Soft delete : l'article quitte la carte mais reste en base pour
  // préserver l'historique des commandes qui le référencent.
  await record.update({ deleted_at: new Date() });
  return true;
};
