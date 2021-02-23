module.exports = {

  friendlyName: 'Send move reminder notifications',

  description: 'Send an email to the current turn player for each game not moved in a given period of time.',

  inputs: {

    hoursSinceLastMove: {
      required: true,
      type: 'number',
      example: 24,
      description: 'The number of hours since the last move was made',
    }

  },

  exits: {

    success: {
      description: 'Notifications sent successfully.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided hours since last move value is invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

  },

  fn: async function (inputs) {

    let hours = inputs.hoursSinceLastMove;

    let openGames = await Game.find(
      {
        where: {
          winner: '',
          archived: false
        }
      }
    );

    if (!openGames) { return; }

    let gameNotifications = [];

    for (let openGame of openGames) {
      let lastMove = await Game.lastMove(openGame);

      // sails.log(`lastMove is ${JSON.stringify(lastMove)}`);

      if (lastMove && !lastMove.reminderNotificationSent
        && (Date.now() - lastMove.createdAt) > hours*3600000)
      {
        let currentTurnPlayer = await Game.currentTurnPlayer(openGame);
        let notCurrentTurnPlayer = await Game.notCurrentTurnPlayer(openGame);
        gameNotifications.push(
          {
            moveId: lastMove.id,
            emailAddress: currentTurnPlayer.emailAddress,
            name: currentTurnPlayer.name,
            opponentAlias: notCurrentTurnPlayer.alias
          }
        );
      }

    }

    // sails.log(`gameNotifications is ${JSON.stringify(gameNotifications)}`);

    if (!gameNotifications.length === 0) { return; }

    for (let gameNotification of gameNotifications) {
      await sails.helpers.sendTemplateEmail.with({
        to: gameNotification.emailAddress,
        toName: gameNotification.name,
        subject: 'Elephant Chess Move Reminder',
        template: 'email-move-reminder',
        templateData: {
          turnPlayerName: gameNotification.name,
          opponentAlias: gameNotification.opponentAlias,
        }
      });

      await Move.update(
        {
          id: gameNotification.moveId
        },
        {
          reminderNotificationSent: true
        }
      );
    }

    return;

  }

};
