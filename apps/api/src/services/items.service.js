import Item from "../models/items.model.js";
import Category from "../models/categories.model.js";
import CommandItem from "../models/commands_items.model.js";
import CommandItemOption from "../models/commands_items_options.model.js";
import ItemItemOption from "../models/items_item_options.model.js";
import sequelize from "../config/database.js";

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

  await sequelize.transaction(async (transaction) => {
    const commandItems = await CommandItem.findAll({ where: { item_id: id }, transaction });
    const commandItemIds = commandItems.map((ci) => ci.id);

    if (commandItemIds.length) {
      await CommandItemOption.destroy({ where: { commands_items_id: commandItemIds }, transaction });
      await CommandItem.destroy({ where: { item_id: id }, transaction });
    }

    await ItemItemOption.destroy({ where: { item_id: id }, transaction });
    await record.destroy({ transaction });
  });

  return true;
};
