import Command from "../models/commands.model.js";
import { formatOrderNumber } from "../utils/orderNumber.js";
import User from "../models/users.model.js";
import CommandType from "../models/commands_types.model.js";
import StateCommand from "../models/state_commands.model.js";
import Table from "../models/tables.model.js";
import CommandItem from "../models/commands_items.model.js";
import Item from "../models/items.model.js";

const includes = [
  { model: User, attributes: ["id", "name", "email"] },
  { model: CommandType, attributes: ["id", "name"] },
  { model: StateCommand, attributes: ["id", "state", "color", "position", "is_final", "visible_on_mobile"] },
  { model: Table, attributes: ["id", "numero"] },
  { model: CommandItem, include: [{ model: Item, attributes: ["id", "name", "price"] }] }
];

export const getAll = async (includeDeleted = false) =>
  Command.findAll({ where: includeDeleted ? {} : { deleted_at: null }, include: includes });

export const getById = async (id) => Command.findByPk(id, { include: includes });

export const create = async (data) => {
  const record = await Command.create(data);
  // Le code dépend de l'id auto-incrémenté : on le renseigne juste après.
  if (!record.code) {
    await record.update({ code: formatOrderNumber(record.id) });
  }
  return record;
};

export const update = async (id, data) => {
  const record = await Command.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await Command.findByPk(id);
  if (!record || record.deleted_at) return null;

  // Soft delete : la commande sort de l'interface mais reste en base
  // (historique, statistiques, intégrité des lignes/paiements conservée).
  await record.update({ deleted_at: new Date() });
  return true;
};
