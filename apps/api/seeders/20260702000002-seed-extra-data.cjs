'use strict';

/**
 * Jeu de données complémentaire (articles + commandes).
 *
 * - Prix des boissons cohérents avec le multiplicateur de taille du gobelet
 *   (petit ×0.85, moyen ×1, grand ×1.2), comme sur le back-office / mobile.
 * - Commandes variées : sur place / à emporter, tous les statuts.
 * - Démonstration du soft delete :
 *     · l'article #47 (édition saisonnière) est marqué supprimé mais reste
 *       référencé par une commande de l'historique (commande #13) ;
 *     · la commande #16 est marquée supprimée (absente des listes, conservée
 *       en base).
 */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const deletedAt = new Date();

    // ── Articles (IDs 37-47) ──────────────────────────────────────────────
    await queryInterface.bulkInsert('items', [
      // Boissons chaudes (cat 1)
      { name: 'Cortado',            slug: 'cortado',            price: 3.20, category_id: 1 },
      { name: 'Ristretto',          slug: 'ristretto',          price: 2.60, category_id: 1 },
      { name: 'Moka',               slug: 'moka',               price: 4.30, category_id: 1 },
      // Boissons froides (cat 2)
      { name: 'Frappé caramel',     slug: 'frappe-caramel',     price: 5.50, category_id: 2 },
      { name: 'Thé glacé pêche',    slug: 'the-glace-peche',    price: 4.20, category_id: 2 },
      { name: 'Cold brew',          slug: 'cold-brew',          price: 4.60, category_id: 2 },
      // Pâtisseries (cat 3)
      { name: 'Financier',          slug: 'financier',          price: 1.80, category_id: 3 },
      { name: 'Scone myrtille',     slug: 'scone-myrtille',     price: 2.90, category_id: 3 },
      // Snacks (cat 4)
      { name: 'Bagel saumon',       slug: 'bagel-saumon',       price: 7.80, category_id: 4 },
      { name: 'Quiche lorraine',    slug: 'quiche-lorraine',    price: 5.90, category_id: 4 },
      // Édition saisonnière retirée de la carte (soft delete)
      { name: 'Latte citrouille',   slug: 'latte-citrouille',   price: 4.90, category_id: 1, deleted_at: deletedAt }
    ]);

    // ── Associations articles ↔ options ───────────────────────────────────
    await queryInterface.bulkInsert('items_item_options', [
      { item_id: 37, item_option_id: 1  }, // Cortado + Lait végétal
      { item_id: 37, item_option_id: 2  }, // Cortado + Double shot
      { item_id: 39, item_option_id: 4  }, // Moka + Chantilly
      { item_id: 39, item_option_id: 5  }, // Moka + Sirop caramel
      { item_id: 40, item_option_id: 13 }, // Frappé caramel + Glacé
      { item_id: 40, item_option_id: 4  }, // Frappé caramel + Chantilly
      { item_id: 42, item_option_id: 13 }, // Cold brew + Glacé
      { item_id: 47, item_option_id: 10 }  // Latte citrouille + Sirop vanille
    ]);

    // ── Commandes (IDs 10-16) ─────────────────────────────────────────────
    await queryInterface.bulkInsert('commands', [
      // 10 — sur place, en préparation
      { code: 'AAA010', user_id: 3,  type_id: 1, state_command_id: 2, total_price: 6.96,  tva_rate: 10.00, table_id: 4,   created_at: new Date(now - 240000),  updated_at: new Date(now - 120000)  },
      // 11 — à emporter, prête
      { code: 'AAA011', user_id: 5,  type_id: 2, state_command_id: 3, total_price: 18.80, tva_rate: 10.00, table_id: null, created_at: new Date(now - 800000),  updated_at: new Date(now - 300000)  },
      // 12 — sur place, en attente
      { code: 'AAA012', user_id: 7,  type_id: 1, state_command_id: 1, total_price: 8.52,  tva_rate: 10.00, table_id: 12,  created_at: new Date(now - 150000),  updated_at: new Date(now - 150000)  },
      // 13 — à emporter, livrée (contient l'article supprimé #47)
      { code: 'AAA013', user_id: 9,  type_id: 2, state_command_id: 4, total_price: 11.78, tva_rate: 10.00, table_id: null, created_at: new Date(now - 86400000), updated_at: new Date(now - 82800000) },
      // 14 — sur place, livrée
      { code: 'AAA014', user_id: 10, type_id: 1, state_command_id: 4, total_price: 15.16, tva_rate: 10.00, table_id: 20,  created_at: new Date(now - 6000000), updated_at: new Date(now - 2400000) },
      // 15 — à emporter, annulée
      { code: 'AAA015', user_id: 11, type_id: 2, state_command_id: 5, total_price: 4.20,  tva_rate: 10.00, table_id: null, created_at: new Date(now - 9600000), updated_at: new Date(now - 9000000) },
      // 16 — commande supprimée (soft delete) : conservée en base, absente des listes
      { code: 'AAA016', user_id: 6,  type_id: 1, state_command_id: 2, total_price: 9.21,  tva_rate: 10.00, table_id: 8,   created_at: new Date(now - 1800000), updated_at: new Date(now - 900000), deleted_at: deletedAt }
    ]);

    // ── Lignes de commande (cis IDs 23-36) ────────────────────────────────
    await queryInterface.bulkInsert('commands_items', [
      // Commande 10
      { item_id: 39, command_id: 10, quantity: 1, unit_price: 5.16, line_total: 5.16, size: 'grand' },
      { item_id: 43, command_id: 10, quantity: 1, unit_price: 1.80, line_total: 1.80, size: null    },
      // Commande 11
      { item_id: 40, command_id: 11, quantity: 2, unit_price: 5.50, line_total: 11.00, size: 'moyen' },
      { item_id: 45, command_id: 11, quantity: 1, unit_price: 7.80, line_total: 7.80,  size: null    },
      // Commande 12
      { item_id: 37, command_id: 12, quantity: 1, unit_price: 2.72, line_total: 2.72, size: 'petit' },
      { item_id: 44, command_id: 12, quantity: 2, unit_price: 2.90, line_total: 5.80, size: null    },
      // Commande 13 (article #47 supprimé)
      { item_id: 47, command_id: 13, quantity: 1, unit_price: 5.88, line_total: 5.88, size: 'grand' },
      { item_id: 46, command_id: 13, quantity: 1, unit_price: 5.90, line_total: 5.90, size: null    },
      // Commande 14
      { item_id: 42, command_id: 14, quantity: 1, unit_price: 4.60, line_total: 4.60, size: 'moyen' },
      { item_id: 31, command_id: 14, quantity: 1, unit_price: 5.50, line_total: 5.50, size: null    },
      { item_id: 2,  command_id: 14, quantity: 1, unit_price: 4.56, line_total: 4.56, size: 'grand' },
      // Commande 15
      { item_id: 41, command_id: 15, quantity: 1, unit_price: 4.20, line_total: 4.20, size: 'moyen' },
      // Commande 16 (supprimée)
      { item_id: 38, command_id: 16, quantity: 1, unit_price: 2.21, line_total: 2.21, size: 'petit' },
      { item_id: 36, command_id: 16, quantity: 1, unit_price: 7.00, line_total: 7.00, size: null    }
    ]);

    // ── Options sur lignes de commande ────────────────────────────────────
    await queryInterface.bulkInsert('commands_items_options', [
      { commands_items_id: 33, item_options_id: 5, extra_price: 0.50 } // Cappuccino (cmd 14) + Sirop caramel
    ]);
  },

  async down(queryInterface) {
    const { Op } = require('sequelize');
    await queryInterface.bulkDelete('commands_items_options', { commands_items_id: { [Op.gte]: 23 } }, {});
    await queryInterface.bulkDelete('commands_items', { command_id: { [Op.gte]: 10 } }, {});
    await queryInterface.bulkDelete('commands', { id: { [Op.gte]: 10 } }, {});
    await queryInterface.bulkDelete('items_item_options', { item_id: { [Op.gte]: 37 } }, {});
    await queryInterface.bulkDelete('items', { id: { [Op.gte]: 37 } }, {});
  }
};
