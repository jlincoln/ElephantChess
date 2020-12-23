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
      archived: false,
      or: [
        { white: this.req.session.userId },
        { black: this.req.session.userId }
      ]
    })
    .populate('white')
    .populate('black')
    .populate('chats', { sort: 'createdAt desc', limit: 100 } );

    var opponents = await User.find({
      id: {'!=': this.req.session.userId}
    });

    _.each(opponents, (opponent, index) => {
      opponents[index] = _.pick(opponent, ['id','alias']);
    });

    // set activeColor attribute based upon segment 2 of FEN
    _.each(games, (game, index) => {
      games[index].activeColor = game.currentFEN.split(' ')[1];
      games[index].userId = this.req.session.userId;
      if (game.white.id === this.req.session.userId) {
        games[index].userSide = 'white';
        games[index].opponent = game.black.alias;
        delete games[index].black;
        delete games[index].white;
      } else {
        games[index].userSide = 'black';
        games[index].opponent = game.white.alias;
        delete games[index].black;
        delete games[index].white;
      }
    });

    // sails.log(`games is ${JSON.stringify(games)}`);

    // Respond with view.
    return {
      currentSection: 'games',
      games: games,
      opponents: opponents
    };

  }

};
