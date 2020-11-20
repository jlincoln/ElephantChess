module.exports = {


  friendlyName: 'Chat',


  description: 'Create a chat message for a game.',


  inputs: {
    id: {
      type: 'number',
      description: 'game id'
    },
    message: {
      type: 'string',
      description: 'chat message text'
    },
  },


  exits: {
    notFound: {
      description: 'Unable to create chat.',
      responseType: 'notFound'
    }
  },


  fn: async function (inputs) {

    if (!this.req.isSocket) {
      throw 'notFound';
    }

    let createdChat = await Chat.create(
      {
        game: inputs.id,
        sender: this.req.session.userId,
        message: inputs.message
      })
    .fetch();

    if (!createdChat) {
      return this.res.notFound();
    } else {
      // setup websocket room
      let roomName = `game-chat:${inputs.id}`;
      sails.sockets.broadcast(roomName, roomName, createdChat);
    }

    return;

  }


};
