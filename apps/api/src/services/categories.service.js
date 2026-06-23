import Category from "../models/categories.model.js";
import Item from "../models/items.model.js";

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

  const itemCount = await Item.count({ where: { category_id: id } });
  if (itemCount > 0) {
    throw Object.assign(
      new Error("Impossible de supprimer cette catégorie : des articles y sont encore associés."),
      { status: 409 }
    );
  }

  await record.destroy();
  return true;
};
