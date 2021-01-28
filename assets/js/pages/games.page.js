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
    fullGames: [],
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
    this.fullGames = this._marshalEntries(this.games);
    this.games = [...this.fullGames];
    this.opponents = this._marshalEntries(this.opponents);
  },

  mounted: async function() {
    this.$find('[data-toggle="tooltip"]').tooltip();

    if (!this.hasJoinedMyGamesRoom) {
      // join my games room
      io.socket.post('/api/v1/game/join-my-games',
        {
          _csrf: window.SAILS_LOCALS._csrf
        },
        // (resData, jwRes) => {
        () => {
          this.hasJoinedMyGamesRoom = true;
        }
      );
    }

    io.socket.on('my-games-create',(data) => {
      alert(`${data.opponent} has challenged you to a new game. Refresh the page to begin.`);
    });

    var filterEl = document.getElementById('filter');
    filterEl.focus(); // set focus to filter element


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

    filter() {
      this.games = [...this.fullGames];
      let criteria = document.getElementById('filter').value;
      this.games = this.games.filter((g) => {
        if (g.name.concat(g.opponent,g.userSide,g.mode).toLowerCase().includes(criteria.toLowerCase())) {
          return g;
        }
      });
    },

    handleParsingCreateGameForm: function(argins) {
      // TODO: Is this needed for anything?
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      return argins;
    },

    openCreateGameForm: function() {
      this.creatingGame = true;
      return;
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
