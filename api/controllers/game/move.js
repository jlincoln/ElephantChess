module.exports = {

  friendlyName: 'Move',

  description: 'Handle a move in the game',

  inputs: {
    id: {
      type: 'number',
      description: 'game id'
    },
    fen: {
      type: 'string',
      description: 'current game fen'
    },
    winner: {
      type: 'string',
      description: 'color (black, white) of winner.'
    },

  },

  exits: {

  },

  fn: async function (inputs) {

    if (!this.req.isSocket) {
      return this.res.badRequest();
    }

    let updatedGame = await Game.updateOne(
      {
        id: inputs.id
      },
      {
        currentFEN: inputs.fen,
        winner: inputs.winner
      }
    );

    if (!updatedGame) {
      return this.res.notFound();
    }

    if (inputs.winner) {
      // calculate players' rating

      let winnerUserId = (inputs.winner === 'white') ? updatedGame.white : updatedGame.black;
      let loserUserId = (inputs.winner === 'white') ? updatedGame.black : updatedGame.white;

      let winnerUser = await User.findOne({id: winnerUserId});
      let loserUser = await User.findOne({id: loserUserId});

      let winnerNewRating;
      let loserNewRating;

      if (loserUser.rating <= 0) {
        winnerNewRating = winnerUser.rating + 1;
        loserNewRating = 0;
      } else if (loserUser.rating === winnerUser.rating) {
        winnerNewRating = winnerUser.rating + 1;
        loserNewRating = loserUser.rating - 1;
      } else if (loserUser.rating > winnerUser.rating) {
        // winner beat a higher rated player so give them more points from the loser
        let diff = Math.abs(loserUser.rating - winnerUser.rating);
        let diffPercentOfLoser = diff/loserUser.rating;
        winnerNewRating = winnerUser.rating + Math.ceil(diff * diffPercentOfLoser);
        loserNewRating = loserUser.rating - Math.ceil(diff * diffPercentOfLoser);
      } else if (loserUser.rating < winnerUser.rating) {
        // winner beat a lower rated player so give them less points from the loser
        let diff = Math.abs(loserUser.rating - winnerUser.rating);
        let diffPercentOfWinner = diff/winnerUser.rating;
        winnerNewRating = winnerUser.rating + Math.ceil(diff * diffPercentOfWinner);
        loserNewRating = loserUser.rating - Math.ceil(diff * diffPercentOfWinner);
      }

      await User.updateOne(
        {id: winnerUserId},
        {rating: winnerNewRating}
      );
      await User.updateOne(
        {id: loserUserId},
        {rating: loserNewRating}
      );
    }

    await Move.create({ move: { 'fen': inputs.fen }, game: inputs.id }).fetch();

    // broadcast to move websocket game specific room to other connected sessions
    let roomName = `game:${inputs.id}`;

    sails.sockets.broadcast(roomName, `move-${roomName}`, { gameId: inputs.id, fen: inputs.fen }, this.req);

    return;

  }

};
