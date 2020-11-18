module.exports = {


  friendlyName: 'Admin view accounts',


  description: 'Admin display "Accounts" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/admin/accounts'
    }

  },


  fn: async function () {

    let users = await User.find();

    // Respond with view.
    return {
      users: users
    };

  }


};
