module.exports = {


  friendlyName: 'View notices',


  description: 'Display "Notices" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/admin/notices'
    }

  },


  fn: async function () {

    let notices = await Notice.find({ sort: 'createdAt desc' } );

    // Respond with view.
    return {
      notices: notices
    };

  }


};
