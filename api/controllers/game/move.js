module.exports = {

  friendlyName: 'Move',

  description: 'Handle a move in the game',

  inputs: {
    id: {
      type: 'number',
      description: 'game id'
    },
    fen: {
      type: 'string',
      description: 'current game fen'
    },
    winner: {
      type: 'string',
      description: 'color (black, white) of winner.'
    },

  },

  exits: {

  },

  fn: async function (inputs) {

    sails.log.info('move inputs is ', inputs);

    if (!this.req.isSocket) {
      return this.res.badRequest();
    }

    Game.update(
      {
        id: inputs.id
      },
      {
        currentFEN: inputs.fen,
        winner: inputs.winner
      }
    ).exec((err, updatedGame) => {
      if (err) { this.res.notFound(); }

      sails.log.info(`updated ${updatedGame}`);
      // TODO; push move onto moves array attribute
    });

    // setup websocket room
    let roomName = `game:${inputs.id}`;

    sails.sockets.join(this.req, roomName);

    sails.sockets.broadcast(roomName, 'move', { gameId: inputs.id, fen: inputs.fen }, this.req);

    return;

  }


};
