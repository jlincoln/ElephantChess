module.exports = {

  friendlyName: 'Chess Games',

  description: 'Display "Chess games" page.',

  inputs: {
    playerId: {
      type: 'number',
      description: 'id of player',
    },
    id: {
      type: 'number',
      description: 'id of game',
    },
  },

  exits: {

    success: {
      viewTemplatePath: 'pages/games'
    }

  },

  fn: async function(req) {

    var games;
    var opponents;

    sails.log(`req is ${JSON.stringify(req)}`);

    // Get the set of games
    if (req.playerId) {
      sails.log(`req.playerId is ${JSON.stringify(req.playerId)}`);
      this.req.playerId = req.playerId;
      games = await Game.find({
        // archived: false,
        or: [
          { white: this.req.playerId },
          { black: this.req.playerId },
        ]
      })
      .populate('white')
      .populate('black');

      // set activeColor attribute based upon segment 2 of FEN
      _.each(games, (game, index) => {
        games[index].activeColor = game.currentFEN.split(' ')[1];
        games[index].userId = '';
        games[index].userSide = '';
        games[index].opponent = game.black.alias;
        if (game.white.id === this.req.playerId) {
          games[index].opponent = game.black.alias;
        } else {
          games[index].opponent = game.white.alias;
        }
        delete games[index].black;
        delete games[index].white;
      });

    } else {
      games = await Game.find({
        archived: false,
        or: [
          { white: this.req.session.userId },
          { black: this.req.session.userId },
        ]
      })
      .populate('white')
      .populate('black')
      .populate('chats', { sort: 'updatedAt desc', limit: 100 } );

      opponents = await User.find({
        id: {'!=': this.req.session.userId},
        isDisabled: false,
      }).sort('alias asc');

      _.each(opponents, (opponent, index) => {
        opponents[index] = _.pick(opponent, ['id','alias','rating']);
        opponents[index].aliasPlusRating = `${opponents[index].alias} (${opponents[index].rating})`;
      });

      // set activeColor attribute based upon segment 2 of FEN
      _.each(games, (game, index) => {
        sails.log(`games[index] is ${JSON.stringify(games[index])}`);
        games[index].activeColor = game.currentFEN.split(' ')[1];
        games[index].userId = this.req.session.userId;
        if (game.white.id === this.req.session.userId) {
          games[index].userSide = 'white';
          games[index].opponent = game.black.alias;
        } else {
          games[index].userSide = 'black';
          games[index].opponent = game.white.alias;
        }
        delete games[index].black;
        delete games[index].white;
      });
    }

    // sails.log(`games is ${JSON.stringify(games)}`);

    // Respond with view.
    return {
      currentSection: 'games',
      games: games,
      opponents: opponents
    };

  }

};
