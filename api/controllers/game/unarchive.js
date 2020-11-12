module.exports = {


  friendlyName: 'Unarchive',


  description: 'Unarchive game.',


  inputs: {

    id: {
      type: 'number',
      description: 'game id'
    },
  },


  exits: {

  },


  fn: async function (inputs) {

    sails.log.info('unarchive inputs is ', inputs);

    if (!this.req.isSocket) {
      return this.res.badRequest();
    }

    Game.update({id: inputs.id}, {archived: false})
    .exec((err, updatedGame) => {
      if (err) { this.res.notFound(); }

      sails.log.info(`updated ${updatedGame}`);
    });

    // All done.
    return;

  }


};
