import Command from "../models/commands.model.js";
import User from "../models/users.model.js";
import CommandType from "../models/commands_types.model.js";
import StateCommand from "../models/state_commands.model.js";
import Table from "../models/tables.model.js";
import CommandItem from "../models/commands_items.model.js";
import Item from "../models/items.model.js";

const includes = [
  { model: User, attributes: ["id", "name", "email"] },
  { model: CommandType, attributes: ["id", "name"] },
  { model: StateCommand, attributes: ["id", "state"] },
  { model: Table, attributes: ["id", "numero"] },
  { model: CommandItem, include: [{ model: Item, attributes: ["id", "name", "price"] }] }
];

export const getAll = async () => Command.findAll({ include: includes });

export const getById = async (id) => Command.findByPk(id, { include: includes });

export const create = async (data) => Command.create(data);

export const update = async (id, data) => {
  const record = await Command.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await Command.findByPk(id);
  if (!record) return null;
  await record.destroy();
  return true;
};
