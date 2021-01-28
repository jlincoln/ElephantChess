module.exports = {


  friendlyName: 'Admin view accounts',


  description: 'Admin display "Accounts" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/admin/accounts'
    }

  },


  fn: async function () {

    let users = await User.find().populate('gamesAsWhite').populate('gamesAsBlack');
    users.forEach((user,idx) => {
      users[idx].totalGamesCount = users[idx].gamesAsWhite.length + users[idx].gamesAsBlack.length;
      // remove unneeded elements
      delete users[idx].gamesAsWhite;
      delete users[idx].gamesAsBlack;
      delete users[idx].password;
      delete users[idx].hasBillingCard;
      delete users[idx].billingCardBrand;
      delete users[idx].billingCardLast4;
      delete users[idx].billingCardExpMonth;
      delete users[idx].billingCardExpYear;
      delete users[idx].tosAcceptedByIp;
    });

    // Respond with view.
    return {
      users: users
    };

  }


};
