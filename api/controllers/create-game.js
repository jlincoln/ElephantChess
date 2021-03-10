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
    // sails.log.info('create-game inputs is ', inputs);
    // sails.log.info('this.req.session.userId is ', this.req.session.userId);
    let gameParams = {};
    gameParams.currentFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    if (inputs.side === 'white') {
      gameParams.black = inputs.opponent;
      gameParams.white = this.req.session.userId;
    } else {
      gameParams.black = this.req.session.userId;
      gameParams.white = inputs.opponent;
    }
    gameParams.mode = inputs.mode;
    gameParams.timeLimit = inputs.timeLimit;
    gameParams.name = inputs.name;

    let creator = await User.findOne({id: this.req.session.userId});

    let game = await Game.create(gameParams);

    // broadcast game creation to user specific websocket room
    let roomName = `my-games:${inputs.opponent}`;

    sails.sockets.broadcast(roomName, 'my-games-create', { gameId: inputs.id, gameName: inputs.name, opponent: creator.alias }, this.req);

    return game;

  }

};
