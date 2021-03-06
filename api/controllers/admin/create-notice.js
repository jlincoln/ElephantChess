module.exports = {


  friendlyName: 'Create notice',


  description: 'Create a notice',


  inputs: {

    title: {
      type: 'string',
      required: true,
      description: 'the title of the message'
    },

    message: {
      type: 'string',
      required: true,
      description: 'the message'
    },

    level: {
      type: 'string',
      required: true,
      description: 'level indicator'
    },

    active: {
      type: 'boolean',
      required: true,
      description: 'Indicates if the message is active or not'
    },

    sendEmail: {
      type: 'boolean',
      required: true,
      description: 'Indicates if the message should be sent via email'
    }


  },


  exits: {

  },


  fn: async function (inputs) {

    let notice = await Notice.create(inputs).fetch();

    if (!notice || !notice.message) {
      return;
    }

    if (inputs.sendEmail) {

      let emailAddresses = [];

      let users = await User.find({
        isDisabled: false,
        emailStatus: 'confirmed'
      });

      for (let user of users) {
        emailAddresses.push(user.emailAddress);
      }

      // AWS documentation says no more than 50 but we will do batches of 25
      const batchSize = 25;
      if (emailAddresses.length > batchSize) {

        while (emailAddresses.length > 0) {

          let emailAddressesBatch = [];

          for (let i = 0; i < batchSize; i++) {
            if (emailAddresses.length === 0) {
              break;
            }
            emailAddressesBatch.push(emailAddresses.pop());
          }

          sails.log(`emailAddressesBatch.length is ${emailAddressesBatch.length}`);

          await sails.helpers.sendTemplateEmail.with({
            to: 'noreply@elephantchess.net',
            bcc: emailAddressesBatch,
            subject: 'Elephant Chess Notification',
            template: 'email-notice',
            templateData: {
              message: notice.message
            }
          });
        }

      } else {

        await sails.helpers.sendTemplateEmail.with({
          to: 'noreply@elephantchess.net',
          bcc: emailAddresses,
          subject: 'Elephant Chess Notification',
          template: 'email-notice',
          templateData: {
            message: notice.message
          }
        });

      }

    }

    // All done.
    return;

  }


};
