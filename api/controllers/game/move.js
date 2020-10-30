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

  },


  exits: {

  },


  fn: async function (inputs) {

    // All done.
    sails.log.info('move inputs is ', inputs);
    Game.update({id: inputs.id}, {currentFEN: inputs.fen})
    .exec((err, updatedRecord) => {
      if (err) {console.log(err);}
      console.log(updatedRecord); }
    );

    return;

  }


};
