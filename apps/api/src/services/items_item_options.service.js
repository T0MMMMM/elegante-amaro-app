import ItemItemOption from "../models/items_item_options.model.js";
import Item from "../models/items.model.js";
import ItemOption from "../models/item_options.model.js";

// On exclut les liaisons dont l'option a été soft-deleted : une option
// supprimée ne doit plus apparaître dans la liste d'options d'un article.
const includes = [
  { model: Item, attributes: ["id", "name"] },
  { model: ItemOption, attributes: ["id", "name", "extra_price"], where: { deleted_at: null }, required: true }
];

export const getAll = async () => ItemItemOption.findAll({ include: includes });

export const getById = async (id) => ItemItemOption.findByPk(id, { include: includes });

export const create = async (data) => ItemItemOption.create(data);

export const remove = async (id) => {
  const record = await ItemItemOption.findByPk(id);
  if (!record) return null;
  await record.destroy();
  return true;
};
