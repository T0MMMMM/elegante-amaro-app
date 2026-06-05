import ItemItemOption from "../models/items_item_options.model.js";
import Item from "../models/items.model.js";
import ItemOption from "../models/item_options.model.js";

export const getAll = async () =>
  ItemItemOption.findAll({
    include: [
      { model: Item, attributes: ["id", "name"] },
      { model: ItemOption, attributes: ["id", "name", "extra_price"] }
    ]
  });

export const getById = async (id) =>
  ItemItemOption.findByPk(id, {
    include: [
      { model: Item, attributes: ["id", "name"] },
      { model: ItemOption, attributes: ["id", "name", "extra_price"] }
    ]
  });

export const create = async (data) => ItemItemOption.create(data);

export const remove = async (id) => {
  const record = await ItemItemOption.findByPk(id);
  if (!record) return null;
  await record.destroy();
  return true;
};
