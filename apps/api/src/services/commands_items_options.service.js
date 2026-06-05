import CommandItemOption from "../models/commands_items_options.model.js";
import ItemOption from "../models/item_options.model.js";

export const getAll = async () =>
  CommandItemOption.findAll({ include: [{ model: ItemOption, attributes: ["id", "name"] }] });

export const getById = async (id) =>
  CommandItemOption.findByPk(id, { include: [{ model: ItemOption, attributes: ["id", "name"] }] });

export const create = async (data) => CommandItemOption.create(data);

export const update = async (id, data) => {
  const record = await CommandItemOption.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await CommandItemOption.findByPk(id);
  if (!record) return null;
  await record.destroy();
  return true;
};
