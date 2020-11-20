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

};

