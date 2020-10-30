module.exports = {


  friendlyName: 'Chess Games',


  description: 'Display "Chess games" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/games'
    }

  },


  fn: async function () {

    // Get the list of things this user can see.
    var games = await Game.find({
      /*
      or: [
        // Friend things:
        { owner: { 'in': _.pluck(this.req.me.friends, 'id') } },
        // My things:
        { owner: this.req.me.id }
      ]
      */
    });

    // games = _.each(games, (game) => {if (game.currentFEN === undefined) game.currentFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";});

    // Respond with view.
    return {
      currentSection: 'games',
      games: games,
    };

  }

};
