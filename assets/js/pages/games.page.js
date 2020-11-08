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
      mode: 'domination',
      opponent: undefined,
      enableTimeLimit: undefined,
      timeLimit: undefined,
    },
    fen: '',
    opponents: [],
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    _.extend(this, SAILS_LOCALS);
    this.games = this._marshalEntries(this.games);
    this.opponents = this._marshalEntries(this.opponents);
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

    handleParsingCreateGameForm: function(argins) {
      // TODO: Is this needed for anything?
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      return argins;
    },

    showThreats: function() {
      return;
    },

    show: function() {
      return;
    },

    submittedCreateGameForm() {
      this.creatingGame = false;
      this.createGameFormSuccess = true;
      this.goto('games');
      return;
    },


  }

});
