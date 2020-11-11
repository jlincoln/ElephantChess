module.exports = {


  friendlyName: 'Archive',


  description: 'Archive game.',


  inputs: {

    id: {
      type: 'number',
      description: 'game id'
    },
  },


  exits: {

  },


  fn: async function (inputs) {

    sails.log.info('archive inputs is ', inputs);

    if (!this.req.isSocket) {
      return this.res.badRequest();
    }

    Game.update({id: inputs.id}, {archived: true})
    .exec((err, updatedGame) => {
      if (err) { this.res.notFound(); }

      sails.log.info(`updated ${updatedGame}`);
      // TODO; push move onto moves array attribute
    });

    let roomName = `game:${inputs.id}`;

    sails.sockets.join(this.req, roomName);

    sails.sockets.broadcast(roomName, 'archived', { gameId: inputs.id });

    // All done.
    return;

  }


};
