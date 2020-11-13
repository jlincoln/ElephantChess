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
    });

    let roomName = `game:${inputs.id}`;

    sails.sockets.broadcast(roomName, `archive-${roomName}`, { gameId: inputs.id });

    // All done.
    return;

  }


};
