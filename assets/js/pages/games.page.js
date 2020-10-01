parasails.registerPage('games', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    games: [],
    creatingGame: false,
    syncing: false,
    createGameFormSuccess: false,
    cloudError: '',
    formErrors: { /* … */ },
    newGameDef: {
      name: undefined,
      side: 'white',
      opponent: undefined,
      enableTimeLimit: undefined,
      timeLimit: undefined,
    },
    opponents: [
      {id: 1, name: 'Jason'},
      {id: 2, name: 'Christine'},
      {id: 3, name: 'Kelsey'},
      {id: 4, name: 'McClain'},
    ],
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    _.extend(this, SAILS_LOCALS);
    this.games = this._marshalEntries(this.games);
  },

  mounted: async function() {
    this.$find('[data-toggle="tooltip"]').tooltip();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    _marshalEntries: function(entries) {
      // Marshal provided array of data and return the modified version.
      return _.map(entries, (entry) => {

        return entry;
      });
    },

    closeCreateGameForm: function() {
      this.creatingGame = false;
      // this.goto('/games');
    },

    openCreateGameForm: function() {
      console.log('newGameForm called');
      this.creatingGame = true;
      return;
    },

    handleParsingCreateGameForm: function() {
      // TODO: Is this needed for anything?
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      return argins;
    },

    resignGame: function(gameId) {
      console.log('resignGame called');
      let game = _.find(this.games, {id: gameId});
      game.name = "Resigned";
      return;
    },

    showThreats: function() {
      return;
    },

    submittedCreateGameForm(event) {
      this.creatingGame = false;
      this.createGameFormSuccess = true;
      // add new game to page
      // sails.log.info('submittedCreateGameForm event is ', event);
      // this.games.unshift({name: "new game", fen: ""});
      this.goto('games');
      return;
    },


  }

});
