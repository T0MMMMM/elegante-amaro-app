import User from "./users.model.js";
import Category from "./categories.model.js";
import Item from "./items.model.js";
import ItemOption from "./item_options.model.js";
import ItemItemOption from "./items_item_options.model.js";
import StateCommand from "./state_commands.model.js";
import CommandType from "./commands_types.model.js";
import Table from "./tables.model.js";
import Command from "./commands.model.js";
import CommandItem from "./commands_items.model.js";
import CommandItemOption from "./commands_items_options.model.js";

// Category <-> Items
Category.hasMany(Item, { foreignKey: "category_id" });
Item.belongsTo(Category, { foreignKey: "category_id" });

// Item <-> ItemOption via items_item_options
Item.hasMany(ItemItemOption, { foreignKey: "item_id" });
ItemItemOption.belongsTo(Item, { foreignKey: "item_id" });
ItemOption.hasMany(ItemItemOption, { foreignKey: "item_option_id" });
ItemItemOption.belongsTo(ItemOption, { foreignKey: "item_option_id" });

// User -> Commands
User.hasMany(Command, { foreignKey: "user_id" });
Command.belongsTo(User, { foreignKey: "user_id" });

// CommandType -> Commands
CommandType.hasMany(Command, { foreignKey: "type_id" });
Command.belongsTo(CommandType, { foreignKey: "type_id" });

// StateCommand -> Commands
StateCommand.hasMany(Command, { foreignKey: "state_command_id" });
Command.belongsTo(StateCommand, { foreignKey: "state_command_id" });

// Table -> Commands
Table.hasMany(Command, { foreignKey: "table_id" });
Command.belongsTo(Table, { foreignKey: "table_id" });

// Command -> CommandItems
Command.hasMany(CommandItem, { foreignKey: "command_id" });
CommandItem.belongsTo(Command, { foreignKey: "command_id" });

// Item -> CommandItems
Item.hasMany(CommandItem, { foreignKey: "item_id" });
CommandItem.belongsTo(Item, { foreignKey: "item_id" });

// CommandItem -> CommandItemOptions
CommandItem.hasMany(CommandItemOption, { foreignKey: "commands_items_id" });
CommandItemOption.belongsTo(CommandItem, { foreignKey: "commands_items_id" });

// ItemOption -> CommandItemOptions
ItemOption.hasMany(CommandItemOption, { foreignKey: "item_options_id" });
CommandItemOption.belongsTo(ItemOption, { foreignKey: "item_options_id" });

export {
  User,
  Category,
  Item,
  ItemOption,
  ItemItemOption,
  StateCommand,
  CommandType,
  Table,
  Command,
  CommandItem,
  CommandItemOption
};
