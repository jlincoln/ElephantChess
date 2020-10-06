module.exports = {

  friendlyName: 'Create game',

  description: 'Create a game',

  inputs: {
    name: {
      type: 'string',
      description: 'name of game',
    }
  },

  exits: {

  },

  fn: async function (inputs) {

    // All done.
    sails.log.info('create-game called');
    sails.log.info('inputs is ', inputs);
    var game = await Game.create(inputs);
    return game;

  }


};
