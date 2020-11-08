module.exports = {


  friendlyName: 'Join chat',


  description: 'join a chat for a particular game',


  inputs: {
    id: {
      type: 'number',
      description: 'game id'
    },
  },


  exits: {

  },


  fn: async function (inputs) {

    sails.log.info('join-chat inputs is ', inputs);

    if (!this.req.isSocket) {
      return this.res.badRequest();
    }

    // setup websocket room
    let roomName = `game-chat:${inputs.id}`;

    sails.sockets.join(this.req, roomName);

    // All done.
    return;

  }


};
