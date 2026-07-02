import User from "../models/users.model.js";

export const getAllUsers = async (includeDeleted = false) => {
  try {
    const users = await User.findAll({ where: includeDeleted ? {} : { deleted_at: null } });
    return users;
  } catch (error) {
    throw new Error("Error fetching users");
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user || user.deleted_at) return null;
    return user;
  } catch (error) {
    throw new Error("Error fetching user");
  }
};

export const createUser = async (data) => {
  try {
    // L'email est unique en base : un compte soft-deleted conserve sa ligne.
    // On réactive donc ce compte plutôt que de heurter la contrainte unique,
    // et on refuse explicitement un doublon sur un compte actif (409).
    if (data?.email) {
      const existing = await User.findOne({ where: { email: data.email } });
      if (existing) {
        if (existing.deleted_at) {
          return await existing.update({ ...data, deleted_at: null });
        }
        throw Object.assign(
          new Error("Un utilisateur avec cet email existe déjà."),
          { status: 409 }
        );
      }
    }
    return await User.create(data);
  } catch (error) {
    if (error.status) throw error;
    throw new Error("Error creating user");
  }
};

export const updateUser = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    if (!user || user.deleted_at) return null;
    return await user.update(data);
  } catch (error) {
    throw new Error("Error updating user");
  }
};

export const removeUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user || user.deleted_at) return null;

    // Soft delete: on conserve l'utilisateur en base pour préserver
    // les jointures avec l'historique des commandes.
    await user.update({ deleted_at: new Date() });

    return true;
  } catch (error) {
    throw new Error("Error deleting user");
  }
};
