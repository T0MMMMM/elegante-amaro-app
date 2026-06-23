'use strict';

/**
 * Retire les images de démo (URLs loremflickr.com) de tous les articles existants.
 * Le champ `image` reste disponible — l'admin peut en ressaisir une via le backoffice.
 */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkUpdate('items', { image: null }, {});
  },

  async down() {
    // Pas de retour en arrière : les anciennes URLs ne sont pas conservées.
  }
};
