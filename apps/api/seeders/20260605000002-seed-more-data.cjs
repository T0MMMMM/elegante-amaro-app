'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // 8 nouveaux users (IDs 5-12)
    await queryInterface.bulkInsert('users', [
      { name: 'Serveur 2',      email: 'serveur2@elegante-amaro.fr', password_hash: '$2b$10$hash2',  fidelity_points: 0,   roles: JSON.stringify(['serveur']) },
      { name: 'Barista 1',      email: 'barista1@elegante-amaro.fr', password_hash: '$2b$10$hash3',  fidelity_points: 0,   roles: JSON.stringify(['barista']) },
      { name: 'Clara Leclerc',  email: 'clara@example.com',          password_hash: '$2b$10$hash4',  fidelity_points: 200, roles: JSON.stringify(['client']) },
      { name: 'David Moreau',   email: 'david@example.com',          password_hash: '$2b$10$hash5',  fidelity_points: 85,  roles: JSON.stringify(['client']) },
      { name: 'Emma Petit',     email: 'emma@example.com',           password_hash: '$2b$10$hash6',  fidelity_points: 310, roles: JSON.stringify(['client']) },
      { name: 'François Blanc', email: 'francois@example.com',       password_hash: '$2b$10$hash7',  fidelity_points: 60,  roles: JSON.stringify(['client']) },
      { name: 'Grace Fontaine', email: 'grace@example.com',          password_hash: '$2b$10$hash8',  fidelity_points: 150, roles: JSON.stringify(['client']) },
      { name: 'Hugo Bernard',   email: 'hugo@example.com',           password_hash: '$2b$10$hash9',  fidelity_points: 30,  roles: JSON.stringify(['client']) }
    ]);

    // 20 nouvelles tables (IDs 11-30)
    await queryInterface.bulkInsert('tables', [
      { numero: 11 }, { numero: 12 }, { numero: 13 }, { numero: 14 }, { numero: 15 },
      { numero: 16 }, { numero: 17 }, { numero: 18 }, { numero: 19 }, { numero: 20 },
      { numero: 21 }, { numero: 22 }, { numero: 23 }, { numero: 24 }, { numero: 25 },
      { numero: 26 }, { numero: 27 }, { numero: 28 }, { numero: 29 }, { numero: 30 }
    ]);

    // 10 nouvelles options (IDs 6-15)
    await queryInterface.bulkInsert('item_options', [
      { name: 'Lait d\'amande',    extra_price: 0.60 },
      { name: 'Lait de soja',      extra_price: 0.50 },
      { name: 'Lait de coco',      extra_price: 0.60 },
      { name: 'Triple shot',       extra_price: 1.20 },
      { name: 'Sirop vanille',     extra_price: 0.50 },
      { name: 'Sirop noisette',    extra_price: 0.50 },
      { name: 'Sans lactose',      extra_price: 0.00 },
      { name: 'Glacé',             extra_price: 0.30 },
      { name: 'Sucre de canne',    extra_price: 0.00 },
      { name: 'Mousse de lait sup',extra_price: 0.40 }
    ]);

    // 24 nouveaux items (IDs 13-36)
    await queryInterface.bulkInsert('items', [
      // Boissons chaudes (cat 1)
      { name: 'Americano',        slug: 'americano',        price: 2.80,  image: null, category_id: 1 },
      { name: 'Flat White',       slug: 'flat-white',       price: 4.20,  image: null, category_id: 1 },
      { name: 'Macchiato',        slug: 'macchiato',        price: 3.00,  image: null, category_id: 1 },
      { name: 'Chocolat chaud',   slug: 'chocolat-chaud',   price: 3.50,  image: null, category_id: 1 },
      { name: 'Thé vert',         slug: 'the-vert',         price: 3.00,  image: null, category_id: 1 },
      { name: 'Thé chai',         slug: 'the-chai',         price: 3.20,  image: null, category_id: 1 },
      { name: 'Matcha latte',     slug: 'matcha-latte',     price: 4.50,  image: null, category_id: 1 },
      { name: 'Café viennois',    slug: 'cafe-viennois',    price: 4.00,  image: null, category_id: 1 },
      // Boissons froides (cat 2)
      { name: 'Smoothie fraise',  slug: 'smoothie-fraise',  price: 5.00,  image: null, category_id: 2 },
      { name: 'Iced Matcha',      slug: 'iced-matcha',      price: 5.20,  image: null, category_id: 2 },
      { name: 'Eau pétillante',   slug: 'eau-petillante',   price: 2.00,  image: null, category_id: 2 },
      { name: 'Lemonade gingembre',slug:'lemonade-gingembre',price: 4.80, image: null, category_id: 2 },
      { name: 'Jus de pomme',     slug: 'jus-pomme',        price: 3.50,  image: null, category_id: 2 },
      { name: 'Infusion glacée',  slug: 'infusion-glacee',  price: 4.00,  image: null, category_id: 2 },
      // Pâtisseries (cat 3)
      { name: 'Madeleine',        slug: 'madeleine',        price: 1.50,  image: null, category_id: 3 },
      { name: 'Éclair café',      slug: 'eclair-cafe',      price: 3.80,  image: null, category_id: 3 },
      { name: 'Muffin myrtille',  slug: 'muffin-myrtille',  price: 2.80,  image: null, category_id: 3 },
      { name: 'Brownie',          slug: 'brownie',          price: 3.00,  image: null, category_id: 3 },
      { name: 'Cheesecake',       slug: 'cheesecake',       price: 5.50,  image: null, category_id: 3 },
      // Snacks (cat 4)
      { name: 'Sandwich poulet',  slug: 'sandwich-poulet',  price: 6.50,  image: null, category_id: 4 },
      { name: 'Wrap végétalien',  slug: 'wrap-vegetalien',  price: 6.00,  image: null, category_id: 4 },
      { name: 'Salade César',     slug: 'salade-cesar',     price: 7.50,  image: null, category_id: 4 },
      { name: 'Granola bowl',     slug: 'granola-bowl',     price: 6.80,  image: null, category_id: 4 },
      { name: 'Toast avocat',     slug: 'toast-avocat',     price: 7.00,  image: null, category_id: 4 }
    ]);

    // Associations items <-> options pour les nouveaux items
    await queryInterface.bulkInsert('items_item_options', [
      { item_id: 13, item_option_id: 2  }, // Americano + Double shot
      { item_id: 13, item_option_id: 4  }, // Americano + Triple shot
      { item_id: 14, item_option_id: 1  }, // Flat White + Lait végétal
      { item_id: 14, item_option_id: 6  }, // Flat White + Lait d'amande
      { item_id: 15, item_option_id: 3  }, // Macchiato + Sans sucre
      { item_id: 16, item_option_id: 4  }, // Chocolat chaud + Chantilly
      { item_id: 16, item_option_id: 10 }, // Chocolat chaud + Mousse de lait
      { item_id: 19, item_option_id: 9  }, // Matcha latte + Lait de soja
      { item_id: 19, item_option_id: 6  }, // Matcha latte + Lait d'amande
      { item_id: 20, item_option_id: 4  }, // Café viennois + Chantilly
      { item_id: 21, item_option_id: 13 }, // Smoothie fraise + Glacé
      { item_id: 22, item_option_id: 6  }, // Iced Matcha + Lait d'amande
    ]);

    // 6 nouvelles commandes (IDs 4-9)
    const now = new Date();
    await queryInterface.bulkInsert('commands', [
      { user_id: 5,  type_id: 1, state_command_id: 1, total_price: 9.20,  tva_rate: 10.00, table_id: 11, created_at: new Date(now - 500000),  updated_at: new Date(now - 500000)  },
      { user_id: 7,  type_id: 2, state_command_id: 3, total_price: 14.50, tva_rate: 10.00, table_id: null, created_at: new Date(now - 900000),  updated_at: new Date(now - 400000)  },
      { user_id: 8,  type_id: 1, state_command_id: 2, total_price: 11.80, tva_rate: 10.00, table_id: 7,  created_at: new Date(now - 700000),  updated_at: new Date(now - 200000)  },
      { user_id: 9,  type_id: 1, state_command_id: 4, total_price: 7.70,  tva_rate: 10.00, table_id: 2,  created_at: new Date(now - 7200000), updated_at: new Date(now - 3600000) },
      { user_id: 10, type_id: 2, state_command_id: 4, total_price: 18.00, tva_rate: 10.00, table_id: null, created_at: new Date(now - 5400000), updated_at: new Date(now - 1800000) },
      { user_id: 11, type_id: 1, state_command_id: 5, total_price: 5.30,  tva_rate: 10.00, table_id: 15, created_at: new Date(now - 10800000),updated_at: new Date(now - 9000000) }
    ]);

    // Items dans les nouvelles commandes (command_id 4-9)
    await queryInterface.bulkInsert('commands_items', [
      // Commande 4
      { item_id: 14, command_id: 4, quantity: 1, unit_price: 4.20,  line_total: 4.20,  size: 'moyen' },
      { item_id: 30, command_id: 4, quantity: 1, unit_price: 3.00,  line_total: 3.00,  size: null    },
      { item_id: 12, command_id: 4, quantity: 1, unit_price: 1.80,  line_total: 1.80,  size: null    },
      // Commande 5
      { item_id: 19, command_id: 5, quantity: 2, unit_price: 4.50,  line_total: 9.00,  size: 'grand' },
      { item_id: 35, command_id: 5, quantity: 1, unit_price: 5.50,  line_total: 5.50,  size: null    },
      // Commande 6
      { item_id: 1,  command_id: 6, quantity: 2, unit_price: 2.50,  line_total: 5.00,  size: 'petit' },
      { item_id: 28, command_id: 6, quantity: 1, unit_price: 3.80,  line_total: 3.80,  size: null    },
      { item_id: 9,  command_id: 6, quantity: 1, unit_price: 2.50,  line_total: 2.50,  size: null    },
      // Commande 7
      { item_id: 13, command_id: 7, quantity: 1, unit_price: 2.80,  line_total: 2.80,  size: 'moyen' },
      { item_id: 31, command_id: 7, quantity: 1, unit_price: 6.50,  line_total: 6.50,  size: null    },
      // Commande 8
      { item_id: 16, command_id: 8, quantity: 2, unit_price: 3.50,  line_total: 7.00,  size: null    },
      { item_id: 36, command_id: 8, quantity: 1, unit_price: 7.00,  line_total: 7.00,  size: null    },
      { item_id: 22, command_id: 8, quantity: 1, unit_price: 4.00,  line_total: 4.00,  size: null    },
      // Commande 9
      { item_id: 2,  command_id: 9, quantity: 1, unit_price: 3.80,  line_total: 3.80,  size: 'moyen' },
      { item_id: 32, command_id: 9, quantity: 1, unit_price: 2.80,  line_total: 2.80,  size: null    },
    ]);

    // Options sur les nouvelles lignes de commande
    await queryInterface.bulkInsert('commands_items_options', [
      { commands_items_id: 8,  item_options_id: 1,  extra_price: 0.50 }, // Flat White + Lait végétal
      { commands_items_id: 11, item_options_id: 10, extra_price: 0.40 }, // Chocolat chaud + Mousse
      { commands_items_id: 14, item_options_id: 2,  extra_price: 0.80 }, // Americano + Double shot
      { commands_items_id: 16, item_options_id: 4,  extra_price: 1.20 }, // Chocolat chaud + Triple shot
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('commands_items_options', { commands_items_id: { [require('sequelize').Op.gte]: 8 } }, {});
    await queryInterface.bulkDelete('commands_items', { command_id: { [require('sequelize').Op.gte]: 4 } }, {});
    await queryInterface.bulkDelete('commands', { id: { [require('sequelize').Op.gte]: 4 } }, {});
    await queryInterface.bulkDelete('items_item_options', { item_id: { [require('sequelize').Op.gte]: 13 } }, {});
    await queryInterface.bulkDelete('items', { id: { [require('sequelize').Op.gte]: 13 } }, {});
    await queryInterface.bulkDelete('item_options', { id: { [require('sequelize').Op.gte]: 6 } }, {});
    await queryInterface.bulkDelete('tables', { numero: { [require('sequelize').Op.gte]: 11 } }, {});
    await queryInterface.bulkDelete('users', { id: { [require('sequelize').Op.gte]: 5 } }, {});
  }
};
