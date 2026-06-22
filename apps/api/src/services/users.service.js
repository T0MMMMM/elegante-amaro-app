import User from "../models/users.model.js";
import Command from "../models/commands.model.js";
import CommandItem from "../models/commands_items.model.js";
import CommandItemOption from "../models/commands_items_options.model.js";
import sequelize from "../config/database.js";

export const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new Error("Error fetching users");
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw new Error("Error fetching user");
  }
};

export const createUser = async (data) => {
  try {
    return await User.create(data);
  } catch (error) {
    throw new Error("Error creating user");
  }
};

export const updateUser = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(data);
  } catch (error) {
    throw new Error("Error updating user");
  }
};

export const removeUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    await sequelize.transaction(async (transaction) => {
      const commands = await Command.findAll({ where: { user_id: id }, transaction });
      const commandIds = commands.map((c) => c.id);

      if (commandIds.length) {
        const commandItems = await CommandItem.findAll({ where: { command_id: commandIds }, transaction });
        const commandItemIds = commandItems.map((ci) => ci.id);

        if (commandItemIds.length) {
          await CommandItemOption.destroy({ where: { commands_items_id: commandItemIds }, transaction });
          await CommandItem.destroy({ where: { command_id: commandIds }, transaction });
        }

        await Command.destroy({ where: { user_id: id }, transaction });
      }

      await user.destroy({ transaction });
    });

    return true;
  } catch (error) {
    throw new Error("Error deleting user");
  }
};