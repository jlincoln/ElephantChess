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

    sails.log.info('move: inputs is ', inputs);

    if (!this.req.isSocket) {
      return this.res.badRequest();
    }

    let updatedGame = await Game.updateOne(
      {
        id: inputs.id
      },
      {
        currentFEN: inputs.fen,
        winner: inputs.winner
      }
    );

    if (!updatedGame) {
      return this.res.notFound();
    }

    sails.log.info(`move: updatedGame is ${JSON.stringify(updatedGame)}`);

    let createdMove = await Move.create({ move: { 'fen': inputs.fen }, game: inputs.id }).fetch();

    sails.log.info(`move: createdMove ${JSON.stringify(createdMove)}`);

    // setup websocket room
    let roomName = `game:${inputs.id}`;

    sails.sockets.join(this.req, roomName);

    sails.sockets.broadcast(roomName, 'move', { gameId: inputs.id, fen: inputs.fen }, this.req);

    return;

  }


};
