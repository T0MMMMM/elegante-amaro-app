import CommandItem from "../models/commands_items.model.js";
import Item from "../models/items.model.js";
import CommandItemOption from "../models/commands_items_options.model.js";
import ItemOption from "../models/item_options.model.js";

const includes = [
  { model: Item, attributes: ["id", "name", "price"] },
  { model: CommandItemOption, include: [{ model: ItemOption, attributes: ["id", "name", "extra_price"] }] }
];

export const getAll = async () => CommandItem.findAll({ include: includes });

export const getById = async (id) => CommandItem.findByPk(id, { include: includes });

export const getByCommandId = async (commandId) =>
  CommandItem.findAll({ where: { command_id: commandId }, include: includes });

export const create = async (data) => CommandItem.create(data);

export const update = async (id, data) => {
  const record = await CommandItem.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await CommandItem.findByPk(id);
  if (!record) return null;
  await record.destroy();
  return true;
};
