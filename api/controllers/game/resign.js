module.exports = {


  friendlyName: 'Resign',


  description: 'Resign game.',


  inputs: {

    id: {
      type: 'number',
      description: 'game id'
    },

    winner: {
      type: 'string',
      description: 'winner color'
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    sails.log.info('resign inputs is ', inputs);

    if (!this.req.isSocket) {
      return this.res.badRequest();
    }

    Game.update({id: inputs.id}, {winner: inputs.winner})
    .exec((err, updatedGame) => {
      if (err) { this.res.notFound(); }

      sails.log.info(`updated ${updatedGame}`);
      // TODO; push move onto moves array attribute
    });

    let roomName = `game:${inputs.id}`;

    sails.sockets.broadcast(roomName, `resign-${roomName}`, { gameId: inputs.id, winner: inputs.winner }, this.req);

    // All done.
    return;

  }


};
