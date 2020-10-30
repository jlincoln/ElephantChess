module.exports = {

  friendlyName: 'Create game',

  description: 'Create a game',

  inputs: {
    opponent: {
      type: 'string',
      description: 'name of opponent',
    },
    mode: {
      type: 'string',
      description: 'game mode',
    },
    side: {
      type: 'string',
      description: 'white or black',
    },
    name: {
      type: 'string',
      description: 'name of game',
    },
    timeLimit: {
      type: 'number',
      description: 'time limit for game',
    },
  },

  exits: {

  },

  fn: async function (inputs) {

    // All done.
    sails.log.info('create-game inputs is ', inputs);
    inputs.currentFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    var game = await Game.create(inputs);
    return game;

  }


  };
