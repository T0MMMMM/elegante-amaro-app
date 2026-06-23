import Table from "../models/tables.model.js";
import Command from "../models/commands.model.js";
import StateCommand from "../models/state_commands.model.js";

export const getAll = async () => Table.findAll();

export const getById = async (id) => Table.findByPk(id);

export const create = async (data) => Table.create(data);

export const update = async (id, data) => {
  const record = await Table.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const remove = async (id) => {
  const record = await Table.findByPk(id);
  if (!record) return null;

  const commands = await Command.findAll({
    where: { table_id: id },
    include: [{ model: StateCommand }]
  });
  const hasUnfinishedCommand = commands.some((c) => c.StateCommand?.state !== "livrée");
  if (hasUnfinishedCommand) {
    throw Object.assign(
      new Error("Impossible de supprimer cette table : des commandes en cours lui sont associées."),
      { status: 409 }
    );
  }

  await record.destroy();
  return true;
};
