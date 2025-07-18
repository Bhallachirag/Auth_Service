'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'mobileNumber', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: /^\d{10}$/, // for model only, not migration — just keep type here
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'mobileNumber');
  }
};
