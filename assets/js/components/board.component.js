/**
 * <board>
 * -----------------------------------------------------------------------------
 * A game board
 *
 * @type {Component}
 *
 * @event click   [emitted when clicked]
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('board', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'id',
    'name',
    'free',
    'orientation',
    'showThreats',
    'fen',
    'userSide',
    'opponent',
    'winner'
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      activeColor: (this.fen.split(' ')[1] === 'w') ? 'White' : 'Black',
      currentFen: this.fen,
      gameWinner: this.winner,
      archivedGame: false,
      placeElephantColor: ''
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
    <div :id="'board-component-div-' + id" :name="'board-component-div-' + (name||'')">
      <div class="panel panel-default">
        <div class="panel-heading lead" style="background-color: lightgrey; border-color: black; text-align: left; padding-left: 2px;">
          Name: <strong>{{name}}</strong>
          Opponent: <strong>{{ opponent }}</strong>
          <span v-if=!gameWinner>
            Turn: <strong>{{ activeColor.toUpperCase() === userSide.toUpperCase() ? 'You' : 'Opponent' }}</strong>
          </span>
          <span v-if=gameWinner>
            Winner: <strong>{{ userSide.toUpperCase() === gameWinner.toUpperCase() ? 'You' : 'Opponent' }}</strong>
          </span>
        </div>
        <div class="panel-heading" style="border-color: lightgrey; border-style: solid; border-width: thin; padding-left: 2px;">
          <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups"> 
            <div class="btn-group mr-2" role="group" aria-label="First group">
              <button class="btn btn-outline-secondary" :title="'You are playing the ' + userSide + ' side.'" @click="showGameSide()" style="width: 46px;">
                <span>{{ (userSide === "white") ? "&#9816;" : "&#9822;" }}</span>
              </button>
              <button class="btn btn-outline-secondary" @click="toggleOrientation()" title="toggle board orientation" style="width: 46px;">
               <i class="fa fa-exchange fa-rotate-90" aria-hidden="true"></i>
              </button>
              <button class="btn btn-outline-secondary" v-if="!gameWinner" @click="resignGame()" title="resign game" style="width: 46px;">
                <span><i class="fa fa-handshake-o"></i></span>
              </button>
              <button class="btn btn-outline-secondary" v-if="!archivedGame" @click="archiveGame()" title="archive game" style="width: 46px;">
                <span><i class="fa fa-archive"></i></span>
              </button>
              <button class="btn btn-outline-secondary" v-if="placeElephantColor.toUpperCase() === userSide.toUpperCase()" @click="placeElephant()" title="place elephant" style="width: 46px;">
                <span><i class="fa fa-plus-square"></i></span>
              </button>
            </div>
          </div>
        </div >
        <div class="panel-body" style="border-color: lightgrey; border-style: solid; border-width: thin;">
          <echessboard
            :name="(name||'')"
            ref="echessboard"
            :free="(free === 'true')"
            :orientation="(orientation||'')"
            :show-threats="(showThreats === 'true')"
            :fen="currentFen"
            @onMove="onMove"
            @onPromption="onPromotion(data)">
          </echessboard>
        </div>
      </div>
    </div>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    //…
  },

  mounted: async function() {

    io.socket.on('move',(data) => {
      console.log(`move socket event captured with ${JSON.stringify(data)}`);
      if (this.id === data.gameId && this.currentFen !== data.fen) {
        this.currentFen = data.fen;
        this.activeColor = (data.fen.split(' ')[1] === 'w') ? 'White' : 'Black';
      }
    });
    io.socket.on('resign',(data) => {
      console.log(`resign socket event captured with ${JSON.stringify(data)}`);
    });
    io.socket.on('archived',(data) => {
      console.log(`archived socket event captured with ${JSON.stringify(data)}`);
      alert("Game archived");
      this.archivedGame = true;
    });

    if (this.winner) {
      // set game to unmovable
      this.$refs.echessboard.board.state.movable.color = '';
    }

  },

  updated: async function() {

  },

  beforeDestroy: function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    archiveGame: function(data) {

      console.log(`archiveGame: data is ${JSON.stringify(data)}`);

      if (this.archivedGame) { return; }

      if (confirm('Confirm archive')) {
        // post the archive
        io.socket.post('/api/v1/game/' + this.id + '/archive',
          {
            id: this.id,
            _csrf: window.SAILS_LOCALS._csrf
          },
          (resData, jwRes) => {
            console.log('archive: resData is ' + JSON.stringify(resData));
            console.log('archive: jwRes is ' + JSON.stringify(jwRes));
            io.socket.post('/api/v1/game/' + this.id + '/chat',
              {
                message: 'archived game',
                _csrf: window.SAILS_LOCALS._csrf
              },
              (resData, jwRes) => {
                console.log('archived message: resData is ' + JSON.stringify(resData));
                console.log('archived message: jwRes is ' + JSON.stringify(jwRes));
              }
            );
          });
      }
    },

    onMove: async function(data) {

      console.log('onMove(data): data is ' + JSON.stringify(data));

      let history = this.$refs.echessboard.game.history({verbose: true});
      if (this.placeElephantColor !== 'X' && history && history[history.length-1] && history[history.length-1].captured) {
        this.placeElephantColor = this.userSide;
      }

      this.currentFen = data['fen'];
      this.activeColor = (data['fen'].split(' ')[1] === 'w') ? 'White' : 'Black';
      let winner = '';
      let checkmate = this.$refs.echessboard.game.in_checkmate();

      if (checkmate) {
        winner = (data['fen'].split(' ')[1] === 'w') ? 'black' : 'white';
        this.gameWinner = winner;
        this.$refs.echessboard.board.state.movable.color = '';
      }

      // post the move
      io.socket.post('/api/v1/game/' + this.id + '/move',
        {
          _csrf: window.SAILS_LOCALS._csrf,
          fen: this.currentFen,
          winner: winner
        },
        (resData, jwRes) => {
          console.log('resData is ' + JSON.stringify(resData));
          console.log('jwRes is ' + JSON.stringify(jwRes));
          if (resData === 'OK' && winner) {
            io.socket.post('/api/v1/game/' + this.id + '/chat',
              {
                _csrf: window.SAILS_LOCALS._csrf,
                message: 'won game'
              },
              (resData, jwRes) => {
                console.log('onMove: won message: resData is ' + JSON.stringify(resData));
                if (resData === 'OK') {
                  console.log('onMove: won message: jwRes is ' + JSON.stringify(jwRes));
                }
              }
            );
          }
        });
      // set game to unmovable
      if (this.$refs.echessboard.board.state.movable.color !== undefined
      && this.$refs.echessboard.board.state.movable.color !== ''
      && this.$refs.echessboard.board.state.movable.color !== this.userSide) {
        this.$refs.echessboard.board.state.movable.color = '';
      }
    },

    onPromotion: function() {
      // console.log('onPromotion(data): data is ' + JSON.stringify(data));
    },

    placeElephant: function() {
      let square = prompt('Enter the square to place elephant (e.g. d4).');
      let result = this.$refs.echessboard.game.put({ type: this.$refs.echessboard.game.ELEPHANT, color: this.userSide[0].toLowerCase() }, square);
      if (result) {
        this.currentFen = this.$refs.echessboard.game.fen();
        this.placeElephantColor = 'X';
      }
    },

    resignGame: function(data) {
      console.log(`resignGame: data is ${JSON.stringify(data)}`);
      if (this.winner) { return; }
      if (confirm('Confirm resign')) {
        let winner = this.userSide.toLowerCase() === 'white' ? 'black' : 'white';
        // post the resignation
        io.socket.post('/api/v1/game/' + this.id + '/resign',
          {
            id: this.id,
            winner: winner,
            _csrf: window.SAILS_LOCALS._csrf
          },
          (resData, jwRes) => {
            console.log('resign: resData is ' + JSON.stringify(resData));
            console.log('resign: jwRes is ' + JSON.stringify(jwRes));
            io.socket.post('/api/v1/game/' + this.id + '/chat',
              {
                message: 'resigned game',
                _csrf: window.SAILS_LOCALS._csrf
              },
              (resData, jwRes) => {
                console.log('resign message: resData is ' + JSON.stringify(resData));
                console.log('resign message: jwRes is ' + JSON.stringify(jwRes));
              }
            );
          });
      }
    },

    showGameSide: function() {
      alert(`You are playing the ${this.userSide} side.`);
    },

    toggleOrientation: function(){
      this.$refs.echessboard.board.toggleOrientation();
    },

  }
});
