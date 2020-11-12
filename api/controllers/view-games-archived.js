module.exports = {

  friendlyName: 'Chess Games Archived',

  description: 'Display "Chess games archived" page.',

  exits: {

    success: {
      viewTemplatePath: 'pages/games-archived'
    }

  },

  fn: async function () {

    // Get the list of things this user can see.
    var games = await Game.find({
      archived: true,
      or: [
        { white: this.req.session.userId },
        { black: this.req.session.userId }
      ]
    })
    .populate('white')
    .populate('black')
    .populate('chats', { sort: 'createdAt desc', limit: 100 } );

    // set activeColor attribute based upon segment 2 of FEN
    _.each(games, (game, index) => {
      games[index].activeColor = game.currentFEN.split(' ')[1];
      games[index].userId = this.req.session.userId;
      if (game.white.id === this.req.session.userId) {
        games[index].userSide = 'white';
        games[index].opponent = game.black.alias || game.black.fullName;
        delete games[index].black;
        delete games[index].white;
      } else {
        games[index].userSide = 'black';
        games[index].opponent = game.white.alias || game.white.fullName;
        delete games[index].black;
        delete games[index].white;
      }
    });

    // Respond with view.
    return {
      currentSection: 'games-archived',
      games: games,
    };

  }

};
