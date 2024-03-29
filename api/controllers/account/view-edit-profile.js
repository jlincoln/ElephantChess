module.exports = {


  friendlyName: 'View edit profile',


  description: 'Display "Edit profile" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/account/edit-profile',
    }

  },


  fn: async function() {

    let id = this.req.param('id');
    let user;

    if (id) {
      user = await User.findOne({id: id});
    }

    if (!user) {
      return {};
    }

    delete user.password;
    delete user.billingCardBrand;
    delete user.billingCardLast4;
    delete user.billingCardExpMonth;
    delete user.billingCardExpYear;
    delete user.hasBillingCard;
    delete user.tosAcceptedByIp;
    delete user.passwordResetToken;

    if (!id) {
      delete user.isSuperAdmin;
    }

    return {
      user: user
    };

  }


};
