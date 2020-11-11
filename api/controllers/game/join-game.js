module.exports = {


  friendlyName: 'Join game room',


  description: 'Join the game web socket room',


  inputs: {
    id: {
      type: 'number',
      description: 'game id'
    },
  },


  exits: {

  },


  fn: async function (inputs) {

    sails.log.info('join-game: inputs is ', inputs);

    if (!this.req.isSocket) {
      return this.res.badRequest();
    }

    // setup websocket room
    let roomName = `game:${inputs.id}`;

    sails.sockets.join(this.req, roomName);

    // All done.
    return;

  }


};
