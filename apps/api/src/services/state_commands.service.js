import StateCommand from "../models/state_commands.model.js";
import Command from "../models/commands.model.js";

export const getAll = async (includeDeleted = false) =>
  StateCommand.findAll(includeDeleted ? {} : { where: { deleted_at: null } });

export const getById = async (id) => StateCommand.findByPk(id);

export const create = async (data) => StateCommand.create(data);

export const update = async (id, data) => {
  const record = await StateCommand.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await StateCommand.findByPk(id);
  if (!record) return null;

  const commandCount = await Command.count({ where: { state_command_id: id } });
  if (commandCount > 0) {
    throw Object.assign(
      new Error("Impossible de supprimer ce statut : il est utilisé par des commandes dans l'historique."),
      { status: 409 }
    );
  }

  await record.update({ deleted_at: new Date() });
  return true;
};
