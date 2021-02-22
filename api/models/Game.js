/**
 * Game.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: 'string'
    },

    winner: {
      type: 'string',
      isIn: ['white','black']
    },

    currentFEN: {
      type: 'json'
    },

    mode: {
      type: 'string',
      description: 'Game play mode (domination or create_and_release)'
    },

    timeLimit: {
      type: 'number',
      description: 'game time limit'
    },

    archived: {
      type: 'boolean',
      description: 'Indicates if the game is archived or not'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    white: {
      model: 'user'
    },

    black: {
      model: 'user'
    },

    moves: {
      collection: 'move',
      via: 'game'
    },

    chats: {
      collection: 'chat',
      via: 'game'
    },

  },

  winnerId: function(game) {
    if (game.winner === 'black') {
      return game.black;
    } else if (game.winner === 'white') {
      return game.white;
    }
  },

  lastMoveTimeStamp: async function(game) {
    let lastGameMove = await Move.find(
      {
        where: {
          game: game.id
        },
        sort: 'createdAt desc',
        limit: 1
      },
    );

    if (!lastGameMove[0]) { return; }

    return lastGameMove[0].createdAt;
  },

  currentTurnPlayer: async function(game) {
    let currentPlayerId = (game.currentFEN.split(' ')[1] === 'w') ? game.white : game.black;

    let currentPlayer = await User.findOne(
      {
        where: {
          id: currentPlayerId
        }
      },
    );

    return {
      emailAddress: currentPlayer.emailAddress,
      name: currentPlayer.fullName,
      alias: currentPlayer.alias,
    };
  },

  notCurrentTurnPlayer: async function(game) {
    let currentPlayerId = (game.currentFEN.split(' ')[1] !== 'w') ? game.white : game.black;

    let currentPlayer = await User.findOne(
      {
        where: {
          id: currentPlayerId
        }
      },
    );

    return {
      emailAddress: currentPlayer.emailAddress,
      name: currentPlayer.fullName,
      alias: currentPlayer.alias,
    };
  },

};

