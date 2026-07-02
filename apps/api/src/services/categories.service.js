import Category from "../models/categories.model.js";

export const getAll = async (includeDeleted = false) =>
  Category.findAll({ where: includeDeleted ? {} : { deleted_at: null } });

export const getById = async (id) => Category.findByPk(id);

export const create = async (data) => Category.create(data);

export const update = async (id, data) => {
  const record = await Category.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await Category.findByPk(id);
  if (!record || record.deleted_at) return null;

  // Soft delete : la catégorie disparaît de l'interface mais reste en base
  // pour préserver le libellé des articles de l'historique.
  await record.update({ deleted_at: new Date() });
  return true;
};
