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

    var gamesPlaying = await Game.find({
      archived: false,
      or: [
        { white: this.req.session.userId },
        { black: this.req.session.userId }
      ]
    });

    var gamesWon = await Game.find({
      winner: this.req.session.userId,
      or: [
        { white: this.req.session.userId },
        { black: this.req.session.userId }
      ]
    });

    var gamesLost = await Game.find({
      winner: !this.req.session.userId,
      or: [
        { white: this.req.session.userId },
        { black: this.req.session.userId }
      ]
    });

    let statistics = {
      gamesPlaying: gamesPlaying.length,
      gamesWon: gamesWon.length,
      gamesLost: gamesLost.length,
      siteRank: 'Not Available'
    };

    return {
      notices: notices,
      statistics: statistics
    };

  }


};
