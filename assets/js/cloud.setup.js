/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["token"]},"logout":{"verb":"GET","url":"/api/v1/account/logout","args":[]},"updatePassword":{"verb":"PUT","url":"/api/v1/account/update-password","args":["password"]},"updateProfile":{"verb":"PUT","url":"/api/v1/account/update-profile","args":["fullName","alias","emailAddress"]},"adminUpdateProfile":{"verb":"PUT","url":"/api/v1/admin/admin-update-profile","args":["id","fullName","alias","emailAddress","isSuperAdmin","isDisabled"]},"updateBillingCard":{"verb":"PUT","url":"/api/v1/account/update-billing-card","args":["stripeToken","billingCardLast4","billingCardBrand","billingCardExpMonth","billingCardExpYear"]},"login":{"verb":"PUT","url":"/api/v1/entrance/login","args":["emailAddress","password","rememberMe"]},"joinChat":{"verb":"PUT","url":"/api/v1/game/:id/join-chat","args":["id"]},"joinGame":{"verb":"PUT","url":"/api/v1/game/:id/join-game","args":["id"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["emailAddress","password","fullName","alias"]},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v1/entrance/send-password-recovery-email","args":["emailAddress"]},"updatePasswordAndLogin":{"verb":"POST","url":"/api/v1/entrance/update-password-and-login","args":["password","token"]},"deliverContactFormMessage":{"verb":"POST","url":"/api/v1/deliver-contact-form-message","args":["emailAddress","topic","fullName","message"]},"createGame":{"verb":"POST","url":"/api/v1/create-game","args":["opponent","mode","side","name","timeLimit"]},"joinMyGames":{"verb":"POST","url":"/api/v1/game/join-my-games","args":[]},"move":{"verb":"POST","url":"/api/v1/game/:id/move","args":["id","fen","winner"]},"chat":{"verb":"POST","url":"/api/v1/game/:id/chat","args":["id","message"]},"resign":{"verb":"POST","url":"/api/v1/game/:id/resign","args":["id","winner"]},"archive":{"verb":"POST","url":"/api/v1/game/:id/archive","args":["id"]},"unarchive":{"verb":"POST","url":"/api/v1/game/:id/unarchive","args":["id"]},"createNotice":{"verb":"POST","url":"/api/v1/admin/create-notice","args":["title","message","level","active"]},"updateNotice":{"verb":"POST","url":"/api/v1/admin/update-notice","args":["id","title","message","level","active"]},"sendMoveReminderNotifications":{"verb":"POST","url":"/api/v1/send-move-reminder-notifications","args":["hoursSinceLastMove"]}}
  /* eslint-enable */

});
