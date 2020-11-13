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

    let createdMove = await Move.create({ move: { 'fen': inputs.fen }, game: inputs.id }).fetch();

    // broadcast to move websocket game specific room to other connected sessions
    let roomName = `game:${inputs.id}`;

    sails.sockets.broadcast(roomName, `move-${roomName}`, { gameId: inputs.id, fen: inputs.fen }, this.req);

    return;

  }


};
