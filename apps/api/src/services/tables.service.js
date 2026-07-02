import Table from "../models/tables.model.js";

export const getAll = async (includeDeleted = false) =>
  Table.findAll({ where: includeDeleted ? {} : { deleted_at: null } });

export const getById = async (id) => Table.findByPk(id);

export const create = async (data) => Table.create(data);

export const update = async (id, data) => {
  const record = await Table.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await Table.findByPk(id);
  if (!record || record.deleted_at) return null;

  // Soft delete : la table disparaît de l'interface mais reste en base
  // pour préserver le lien avec les commandes de l'historique.
  await record.update({ deleted_at: new Date() });
  return true;
};
