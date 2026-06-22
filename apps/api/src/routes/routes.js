import express from "express";
import * as usersCtrl from "../controllers/users.controller.js";
import * as categoriesCtrl from "../controllers/categories.controller.js";
import * as itemsCtrl from "../controllers/items.controller.js";
import * as itemOptionsCtrl from "../controllers/item_options.controller.js";
import * as stateCommandsCtrl from "../controllers/state_commands.controller.js";
import * as commandsTypesCtrl from "../controllers/commands_types.controller.js";
import * as tablesCtrl from "../controllers/tables.controller.js";
import * as commandsCtrl from "../controllers/commands.controller.js";
import * as commandsItemsCtrl from "../controllers/commands_items.controller.js";
import * as commandsItemsOptionsCtrl from "../controllers/commands_items_options.controller.js";
import * as itemsItemOptionsCtrl from "../controllers/items_item_options.controller.js";

const routes = express.Router();

// Users
routes.get("/users", usersCtrl.getUsers);
routes.post("/users", usersCtrl.create);
routes.put("/users/:id", usersCtrl.update);
routes.delete("/users/:id", usersCtrl.remove);

// Categories
routes.get("/categories", categoriesCtrl.getAll);
routes.get("/categories/:id", categoriesCtrl.getById);
routes.post("/categories", categoriesCtrl.create);
routes.put("/categories/:id", categoriesCtrl.update);
routes.delete("/categories/:id", categoriesCtrl.remove);

// Items
routes.get("/items", itemsCtrl.getAll);
routes.get("/items/:id", itemsCtrl.getById);
routes.post("/items", itemsCtrl.create);
routes.put("/items/:id", itemsCtrl.update);
routes.delete("/items/:id", itemsCtrl.remove);

// Item options
routes.get("/item-options", itemOptionsCtrl.getAll);
routes.get("/item-options/:id", itemOptionsCtrl.getById);
routes.post("/item-options", itemOptionsCtrl.create);
routes.put("/item-options/:id", itemOptionsCtrl.update);
routes.delete("/item-options/:id", itemOptionsCtrl.remove);

// Items <-> ItemOptions (liaison)
routes.get("/items-item-options", itemsItemOptionsCtrl.getAll);
routes.get("/items-item-options/:id", itemsItemOptionsCtrl.getById);
routes.post("/items-item-options", itemsItemOptionsCtrl.create);
routes.delete("/items-item-options/:id", itemsItemOptionsCtrl.remove);

// State commands
routes.get("/state-commands", stateCommandsCtrl.getAll);
routes.get("/state-commands/:id", stateCommandsCtrl.getById);
routes.post("/state-commands", stateCommandsCtrl.create);
routes.put("/state-commands/:id", stateCommandsCtrl.update);
routes.delete("/state-commands/:id", stateCommandsCtrl.remove);

// Commands types
routes.get("/commands-types", commandsTypesCtrl.getAll);
routes.get("/commands-types/:id", commandsTypesCtrl.getById);
routes.post("/commands-types", commandsTypesCtrl.create);
routes.put("/commands-types/:id", commandsTypesCtrl.update);
routes.delete("/commands-types/:id", commandsTypesCtrl.remove);

// Tables
routes.get("/tables", tablesCtrl.getAll);
routes.get("/tables/:id", tablesCtrl.getById);
routes.post("/tables", tablesCtrl.create);
routes.put("/tables/:id", tablesCtrl.update);
routes.delete("/tables/:id", tablesCtrl.remove);

// Commands
routes.get("/commands", commandsCtrl.getAll);
routes.get("/commands/:id", commandsCtrl.getById);
routes.post("/commands", commandsCtrl.create);
routes.put("/commands/:id", commandsCtrl.update);
routes.delete("/commands/:id", commandsCtrl.remove);

// Commands items
routes.get("/commands-items", commandsItemsCtrl.getAll);
routes.get("/commands-items/:id", commandsItemsCtrl.getById);
routes.get("/commands/:commandId/items", commandsItemsCtrl.getByCommandId);
routes.post("/commands-items", commandsItemsCtrl.create);
routes.put("/commands-items/:id", commandsItemsCtrl.update);
routes.delete("/commands-items/:id", commandsItemsCtrl.remove);

// Commands items options
routes.get("/commands-items-options", commandsItemsOptionsCtrl.getAll);
routes.get("/commands-items-options/:id", commandsItemsOptionsCtrl.getById);
routes.post("/commands-items-options", commandsItemsOptionsCtrl.create);
routes.put("/commands-items-options/:id", commandsItemsOptionsCtrl.update);
routes.delete("/commands-items-options/:id", commandsItemsOptionsCtrl.remove);

export default routes;
