import { getAllUsers, getUserById } from "../services/users.service.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
};