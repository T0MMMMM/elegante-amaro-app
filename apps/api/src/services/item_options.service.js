import ItemOption from "../models/item_options.model.js";

export const getAll = async () => ItemOption.findAll({ where: { deleted_at: null } });

export const getById = async (id) => ItemOption.findByPk(id);

export const create = async (data) => ItemOption.create(data);

export const update = async (id, data) => {
  const record = await ItemOption.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await ItemOption.findByPk(id);
  if (!record) return null;
  await record.update({ deleted_at: new Date() });
  return true;
};
