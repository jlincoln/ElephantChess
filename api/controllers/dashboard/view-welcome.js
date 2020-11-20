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

    let statistics = {
      gamesPlaying: 10,
      gamesWon: 1,
      gamesLost: 3,
      siteRank: 'Not Available'
    };

    return {
      notices: notices,
      statistics: statistics
    };

  }


};
