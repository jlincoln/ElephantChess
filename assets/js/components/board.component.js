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
      gameWinner: this.winner
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
    <div :id="'board-component-div:' + id" :name="'board-component-div:' + (name||'')">
      <div class="panel panel-default">
        <div class="panel-heading lead" style="background-color: lightgrey; border-color: black; text-align: left; padding-left: 2px;">
          Name: <strong>{{name}}</strong>
          Opponent: <strong>{{ opponent }}</strong>
          <span v-if=!gameWinner>
            Turn: <strong>{{ activeColor.toUpperCase() === userSide.toUpperCase() ? 'You' : 'Opponent' }}</strong>
          </span>
          <span v-if=gameWinner>
            Winner: <strong>{{ activeColor.toUpperCase() === gameWinner.toUpperCase() ? 'You' : 'Opponent' }}</strong>
          </span>
        </div>
        <div class="panel-heading" style="border-color: lightgrey; border-style: solid; border-width: thin; padding-left: 2px;">
          <div class="input-grp mb-3">
            <button class="btn" :title="'You are playing the ' + userSide + ' side.'" @click="showGameSide()">
              <span>{{ (userSide === "white") ? "&#9816;" : "&#9822;" }}</span>
            </button>
            <button class="btn" @click="toggleOrientation" title="toggle board orientation">
              <i class="fa fa-exchange fa-rotate-90" aria-hidden="true"></i>
            </button>
            <button class="btn" v-if="!gameWinner" @click="resignGame" title="resign game">
              <span><i class="fa fa-handshake-o"></i></span>
            </button>
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
        <div class="panel-footer" style="border-color: lightgrey; border-style: solid; border-width: thin;">
          <label>
            <input type="text" name="fen" v-model="currentFen" size="60">
          </label>
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

  mounted: async function(){
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
    if (this.winner) {
      // set game to unmovable
      this.$refs.echessboard.board.state.movable.color = '';
    }
  },

  beforeDestroy: function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    onMove: async function(data) {
      console.log('onMove(data): data is ' + JSON.stringify(data));
      this.currentFen = data['fen'];
      this.activeColor = (data['fen'].split(' ')[1] === 'w') ? 'White' : 'Black';
      let winner = '', checkmate = this.$refs.echessboard.game.in_checkmate();
      if (checkmate) {
        winner = (data['fen'].split(' ')[1] === 'w') ? 'black' : 'white';
        this.gameWinner = winner;
        this.$refs.echessboard.board.state.movable.color = '';
      } 

      // post the move
      io.socket.post(
        '/api/v1/game/' + this.id + '/move',
        { fen: this.currentFen, _csrf: window.SAILS_LOCALS._csrf, winner: winner },
        (resData, jwRes) => {
          console.log('resData is ' + JSON.stringify(resData));
          console.log('jwRes is ' + JSON.stringify(jwRes));
          if (winner) {
            io.socket.post('/api/v1/game/' + this.id + '/chat',
              {
                message: 'won game',
                _csrf: window.SAILS_LOCALS._csrf
              },
              (resData, jwRes) => {
                console.log('onMove: won message: resData is ' + JSON.stringify(resData));
                console.log('onMove: won message: jwRes is ' + JSON.stringify(jwRes));
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

    onPromotion: function(){
      // console.log('onPromotion(data): data is ' + JSON.stringify(data));
    },

    resignGame: function(data) {
      console.log(`resignGame: data is ${JSON.stringify(data)}`);
      if (this.winner) { return; }
      if (confirm('Confirm resign')) {
        let winner = this.userSide.toLowerCase() === 'white' ? 'black' : 'white';
        // post the resignation
        io.socket.post('/api/v1/game/' + this.id + '/resign',
          {
            id: this.currentFen,
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
