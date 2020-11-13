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
    'archived',
    'fen',
    'free',
    'id',
    'mode',
    'name',
    'opponent',
    'orientation',
    'showThreats',
    'userSide',
    'winner'
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      activeColor: (this.fen.split(' ')[1] === 'w') ? 'White' : 'Black',
      archivedGame: this.archived,
      currentFen: this.fen,
      gameWinner: this.winner,
      gameMode: this.mode.charAt(0).toUpperCase() + this.mode.slice(1).replace('_',' '),
      hasJoinedRoom: false
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
    <div :id="'board-component-div-' + id" :name="'board-component-div-' + (name||'')">
      <div class="panel panel-default">
        <div class="panel-heading lead" style="background-color: lightgrey; border-color: black; text-align: left; padding-left: 2px;">
          <strong>{{name}}</strong>
            Opponent: <strong>{{ opponent }}</strong>
          <span v-if=gameMode>
            Mode: <strong>{{ gameMode }}</strong>
          </span>
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
              <button class="btn btn-outline-secondary" @click="paintThreats()" :title="activeColor === userSide ? 'show attacks' : 'show threats'" style="width: 46px;">
                <i class="fa fa-crosshairs" aria-hidden="true"></i>
              </button>
              <button class="btn btn-outline-secondary" v-if="!gameWinner" @click="resignGame()" title="resign game" style="width: 46px;">
                <span><i class="fa fa-handshake-o"></i></span>
              </button>
              <button class="btn btn-outline-secondary" v-if="!archivedGame" @click="archiveGame()" title="archive game" style="width: 46px;">
                <span><i class="fa fa-archive"></i></span>
              </button>
              <button class="btn btn-outline-secondary" v-if="archivedGame" @click="unArchiveGame()" title="unarchive game" style="width: 46px;">
                <span><i class="fa fa-archive"></i></span>
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

    console.log('mounted: ');

    if (!this.hasJoinedRoom) {
      // join game room
      console.log('mounted: joining game room');
      io.socket.put('/api/v1/game/' + this.id + '/join-game',
        {
          _csrf: window.SAILS_LOCALS._csrf
        },
        (resData, jwRes) => {
          console.log('mounted: join-game resData is ' + JSON.stringify(resData));
          console.log('mounted: join-game jwRes is ' + JSON.stringify(jwRes));
          this.hasJoinedRoom = true;
        }
      );
    }

    io.socket.on(`move-game:${this.id}`,(data) => {
      console.log(`move socket event captured with ${JSON.stringify(data)}`);
      if (this.currentFen !== data.fen) {
        console.log(`move socket event setting this.currentFen`);
        this.currentFen = data.fen;
        this.activeColor = (data.fen.split(' ')[1] === 'w') ? 'White' : 'Black';
      }
    });

    io.socket.on(`resign-game:${this.id}`,(data) => {
      console.log(`resign socket event captured with ${JSON.stringify(data)}`);
    });

    io.socket.on(`archive-game:${this.id}`,(data) => {
      console.log(`archived socket event captured with ${JSON.stringify(data)}`);
      this.archivedGame = true;
    });

    if (this.winner) {
      // set game to unmovable
      this.$refs.echessboard.board.state.movable.color = '';
    }

    // set the game mode
    this.$refs.echessboard.game.set_elephant_mode(this.mode);

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

    unArchiveGame: function(data) {

      console.log(`unArchiveGame: data is ${JSON.stringify(data)}`);

      if (this.unArchivedGame) { return; }

      if (confirm('Confirm unarchive')) {
        // post the unArchive
        io.socket.post('/api/v1/game/' + this.id + '/unarchive',
          {
            id: this.id,
            _csrf: window.SAILS_LOCALS._csrf
          },
          (resData, jwRes) => {
            console.log('unArchive: resData is ' + JSON.stringify(resData));
            console.log('unArchive: jwRes is ' + JSON.stringify(jwRes));
            io.socket.post('/api/v1/game/' + this.id + '/chat',
              {
                message: 'unarchived game',
                _csrf: window.SAILS_LOCALS._csrf
              },
              (resData, jwRes) => {
                console.log('unarchived message: resData is ' + JSON.stringify(resData));
                console.log('unarchived message: jwRes is ' + JSON.stringify(jwRes));
              }
            );
          });
      }
    },

    moveCapturedPiece: function() {
      let history = this.$refs.echessboard.game.history({verbose: true});
      if (history && history[history.length-1] && history[history.length-1].captured) {
        return true;
      } else {
        return false;
      }
    },

    elephantPiecePlaced: function() {
      let re = /[eE]/;
      if (this.currentFen && re.exec(this.currentFen.split(' ')[0])) {
        return true;
      } else {
        return false;
      }
    },

    onMove: async function(data) {

      console.log('onMove(data): data is ' + JSON.stringify(data));

      if (this.moveCapturedPiece() && !this.elephantPiecePlaced()) {
        this.placeElephant();
        this.setBoardUnmovable();
        return;
      }

      // set game to unmovable if active side !== userSide
      if (this.$refs.echessboard.board.state.movable.color !== undefined
      && this.$refs.echessboard.board.state.movable.color !== ''
      && this.$refs.echessboard.board.state.movable.color !== this.userSide) {
        this.setBoardUnmovable();
      }

      if (this.currentFen !== data['fen']) {
        this.currentFen = data['fen'];
        this.activeColor = (data['fen'].split(' ')[1] === 'w') ? 'White' : 'Black';
      } else {
        // move already posted
        return;
      }

      let winner = '';
      let checkmate = this.$refs.echessboard.game.in_checkmate();
      let check = this.$refs.echessboard.game.in_check();
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
          if (resData === 'OK' && checkmate) {
            io.socket.post('/api/v1/game/' + this.id + '/chat',
              {
                _csrf: window.SAILS_LOCALS._csrf,
                message: 'checkmate'
              },
              (resData, jwRes) => {
                console.log('onMove: checkmate message: resData is ' + JSON.stringify(resData));
                if (resData === 'OK') {
                  winner = (data['fen'].split(' ')[1] === 'w') ? 'black' : 'white';
                  this.gameWinner = winner;
                  this.$refs.echessboard.board.state.movable.color = '';
                } else {
                  console.log('onMove: checkmate message: jwRes is ' + JSON.stringify(jwRes));
                }
              }
            );
          } else if (check) {
            io.socket.post('/api/v1/game/' + this.id + '/chat',
              {
                _csrf: window.SAILS_LOCALS._csrf,
                message: 'check'
              },
              (resData, jwRes) => {
                console.log('onMove: check message: resData is ' + JSON.stringify(resData));
                if (resData !== 'OK') {
                  console.log('onMove: check message: jwRes is ' + JSON.stringify(jwRes));
                }
              }
            );
          }
        });
    },

    onPromotion: function() {
      // console.log('onPromotion(data): data is ' + JSON.stringify(data));
    },

    paintThreats() {
      this.$refs.echessboard.paintThreats();
    },

    placeElephant: function() {
      let square = prompt('Enter the square to place elephant (e.g. d4).');
      let result = this.$refs.echessboard.game.put({ type: this.$refs.echessboard.game.ELEPHANT, color: this.userSide[0].toLowerCase() }, square);
      if (result) {
        this.currentFen = this.$refs.echessboard.game.fen();
        // post the move
        io.socket.post('/api/v1/game/' + this.id + '/move',
          {
            _csrf: window.SAILS_LOCALS._csrf,
            fen: this.currentFen,
            winner: ''
          },
          (resData, jwRes) => {
            console.log('resData is ' + JSON.stringify(resData));
            console.log('jwRes is ' + JSON.stringify(jwRes));
            if (resData === 'OK') {
              io.socket.post('/api/v1/game/' + this.id + '/chat',
                {
                  _csrf: window.SAILS_LOCALS._csrf,
                  message: 'added elephant'
                },
                (resData, jwRes) => {
                  console.log('placeElephant: added elephant message resData is ' + JSON.stringify(resData));
                  console.log('placeElephant: added elephant message jwRes is ' + JSON.stringify(jwRes));
                }
              );
            } else {
              console.log('placeElephant: added elephant message resData nopt OK jwRes is ' + JSON.stringify(jwRes));
            }
          });
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

    setBoardUnmovable: function() {
      this.$refs.echessboard.board.state.movable.color = '';
    },

    showGameSide: function() {
      alert(`You are playing the ${this.userSide} side.`);
    },

    toggleOrientation: function(){
      this.$refs.echessboard.board.toggleOrientation();
    },

  }
});
