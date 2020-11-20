module.exports = {


  friendlyName: 'View welcome page',


  description: 'Display the dashboard "Welcome" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/welcome',
      description: 'Display the welcome page for authenticated users.'
    },

  },


  fn: async function () {

    let notices = await Notice.find({active: true}).sort('createdAt desc');

    let gamesPlayed = 0;
    let gamesPlaying = 0;
    let gamesWon = 0;
    let gamesLost = 0;

    var allPlayerGames = await Game.find({
      or: [
        { white: this.req.session.userId },
        { black: this.req.session.userId }
      ]
    });

    allPlayerGames.forEach(playerGame => {
      console.log(`view-welcome playerGame is ${JSON.stringify(playerGame)}`);
      console.log(`view-welcome Game.winnerId(playerGame) is ${Game.winnerId(playerGame)}`);
      gamesPlayed++;
      if (!playerGame.archived) {
        console.log('view-welcome gamesPlaying++');
        gamesPlaying++;
      }
      if (Game.winnerId(playerGame) === this.req.session.userId) {
        console.log('view-welcome gamesWon++');
        gamesWon++;
      }
      if ((Game.winnerId(playerGame) !== undefined) && (Game.winnerId(playerGame) !== this.req.session.userId)) {
        console.log('view-welcome gamesLost++');
        gamesLost++;
      }
    });

    let statistics = {
      gamesPlayed: gamesPlayed,
      gamesPlaying: gamesPlaying,
      gamesWon: gamesWon,
      gamesLost: gamesLost,
      siteRank: 'Not Available'
    };

    return {
      notices: notices,
      statistics: statistics
    };

  }


};
