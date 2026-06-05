CREATE TABLE `users` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(55),
  `email` varchar(155) UNIQUE,
  `password_hash` varchar(255),
  `fidelity_points` int,
  `roles` json
);

CREATE TABLE `items` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(55),
  `slug` varchar(150) UNIQUE,
  `price` decimal(10,2),
  `image` varchar(255),
  `category_id` bigint
);

CREATE TABLE `categories` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(55) UNIQUE
);

CREATE TABLE `item_options` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(55),
  `extra_price` decimal(10,2)
);

CREATE TABLE `commands` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint,
  `type_id` bigint,
  `state_command_id` bigint,
  `total_price` decimal(10,2),
  `created_at` timestamp,
  `updated_at` timestamp,
  `tva_rate` decimal(5,2),
  `table_id` bigint
);

CREATE TABLE `state_commands` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `state` varchar(55) UNIQUE
);

CREATE TABLE `commands_types` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(55) UNIQUE
);

CREATE TABLE `commands_items` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `item_id` bigint,
  `command_id` bigint,
  `quantity` int(20),
  `unit_price` decimal(10,2),
  `line_total` decimal(10,2),
  `size` ENUM ('petit', 'moyen', 'grand')
);

CREATE TABLE `commands_items_options` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `commands_items_id` bigint,
  `item_options_id` bigint,
  `extra_price` decimal(10,2)
);

CREATE TABLE `items_item_options` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `item_id` bigint,
  `item_option_id` bigint
);

CREATE TABLE `tables` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `numero` int(10) UNIQUE
);

ALTER TABLE `items` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

ALTER TABLE `commands` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `commands` ADD FOREIGN KEY (`type_id`) REFERENCES `commands_types` (`id`);

ALTER TABLE `commands` ADD FOREIGN KEY (`state_command_id`) REFERENCES `state_commands` (`id`);

ALTER TABLE `commands` ADD FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`);

ALTER TABLE `commands_items` ADD FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);

ALTER TABLE `commands_items` ADD FOREIGN KEY (`command_id`) REFERENCES `commands` (`id`);

ALTER TABLE `commands_items_options` ADD FOREIGN KEY (`commands_items_id`) REFERENCES `commands_items` (`id`);

ALTER TABLE `commands_items_options` ADD FOREIGN KEY (`item_options_id`) REFERENCES `item_options` (`id`);

ALTER TABLE `items_item_options` ADD FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);

ALTER TABLE `items_item_options` ADD FOREIGN KEY (`item_option_id`) REFERENCES `item_options` (`id`);
