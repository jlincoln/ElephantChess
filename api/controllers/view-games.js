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
      or: [
        { white: this.req.session.userId },
        { black: this.req.session.userId }
      ]
    });
  
    var opponents = await User.find({
      id: {'!=': this.req.session.userId}
    });

    _.each(opponents, (opponent, index) => {
      opponents[index] = _.pick(opponent, ['id', 'fullName']);
    });

    // set activeColor attribute based upoon segment 2 of FEN
    _.each(games, (game, index) => {
      games[index].activeColor = game.currentFEN.split(" ")[1];
    });

    // games.activeColor = game

    // Respond with view.
    return {
      currentSection: 'games',
      games: games,
      opponents: opponents
    };

  }

};
