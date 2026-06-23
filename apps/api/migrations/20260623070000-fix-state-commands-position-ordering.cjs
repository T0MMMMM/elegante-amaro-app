'use strict';

/**
 * Bug : la page "Statuts" triait côté client avec un fallback `position ?? id`,
 * alors que l'API trie côté SQL avec `ORDER BY position ASC` — et en MySQL/MariaDB
 * les valeurs NULL sont classées en premier. Dès qu'un seul statut avait une
 * position explicite (ex. via les flèches ↑↓), les statuts encore à NULL
 * remontaient en tête côté API (donc dans "Suivi commandes") tout en restant
 * à leur place "naturelle" (par id) côté page "Statuts" : les deux écrans
 * affichaient alors un ordre différent.
 *
 * Cette migration renumérote tous les statuts non supprimés en conservant
 * l'ordre actuellement affiché par la page "Statuts" (COALESCE(position, id)),
 * pour que toutes les positions soient des entiers définis et cohérents partout.
 */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query('SET @rank := 0;');
    await queryInterface.sequelize.query(
      `UPDATE state_commands
       SET position = (@rank := @rank + 1)
       WHERE deleted_at IS NULL
       ORDER BY COALESCE(position, id) ASC, id ASC;`
    );
  },

  async down() {
    // Pas de retour en arrière possible : les anciennes valeurs (dont des NULL) ne sont pas conservées.
  }
};
