module.exports = {


  friendlyName: 'Join my games room',


  description: 'Join the my games web socket room',


  inputs: {
  },


  exits: {

  },


  fn: async function (inputs) {

    sails.log.info('join-my-games: inputs is ', inputs);

    if (!this.req.isSocket) {
      return this.res.badRequest();
    }

    // setup websocket room
    let roomName = `my-games:${this.req.session.userId}`;

    sails.sockets.join(this.req, roomName);

    // All done.
    return;

  }


};
