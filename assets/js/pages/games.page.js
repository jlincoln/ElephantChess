parasails.registerPage('games', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    creatingGame: false,
    fen: '',
    createGameFormSuccess: false,
    cloudError: '',
    formErrors: { /* … */ },
    games: [],
    hasJoinedMyGamesRoom: false,
    newGameDef: {
      name: undefined,
      side: 'white',
      mode: 'domination',
      opponent: undefined,
      enableTimeLimit: undefined,
      timeLimit: undefined,
    },
    opponents: [],
    syncing: false,
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

    if (!this.hasJoinedMyGamesRoom) {
      // join my games room
      console.log('mounted: joining my games room');
      io.socket.post('/api/v1/game/join-my-games',
        {
          _csrf: window.SAILS_LOCALS._csrf
        },
        (resData, jwRes) => {
          console.log('mounted: join-my-games resData is ' + JSON.stringify(resData));
          console.log('mounted: join-my-games jwRes is ' + JSON.stringify(jwRes));
          this.hasJoinedMyGamesRoom = true;
        }
      );
    }

    io.socket.on('my-games-create',(data) => {
      console.log(`my-games-create socket event captured with ${JSON.stringify(data)}`);
      alert(`${data.opponent} has challenged you to a new game. Refresh the page to begin.`);
    });

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
      // console.log('newGameForm called');
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
