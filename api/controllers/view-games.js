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

    // _.each(games, () => {});

    // Respond with view.
    return {
      games: games,
    };

  }

};
