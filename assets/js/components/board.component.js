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
    'opponent'
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      currentFen: this.fen,
      activeColor: (this.fen.split(' ')[1] === 'w') ? 'White' : 'Black'
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
    <div :id="'board-component-div:' + id" :name="'board-component-div:' + (name||'')">
      <span>
        Name: <strong>{{name}}</strong>
        Opponent: <strong>{{ opponent }}</strong>
        Turn: <strong>{{ activeColor === userSide ? 'You' : 'Opponent' }}</strong>
      </span>
      <br>
      <span>
        <button :title="'You are playing the ' + userSide + ' side.'" @click="showGameSide()">
          <span>{{ (userSide === "white") ? "&#9816;" : "&#9822;" }}</span>
        </button>
        <button @click="toggleOrientation" title="toggle board orientation">
          <i class="fa fa-exchange fa-rotate-90" aria-hidden="true"></i>
        </button>
        <button @click="resignGame" title="resign game">
          <span><i class="fa fa-handshake-o"></i></span>
        </button>
      </span>
      <br>
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
      <label>
        <input type="text" name="fen" v-model="currentFen" size="60">
      </label>
    </div>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    //…
  },

  mounted: async function(){
    // create the game move websocket room
    console.log('mounted, creating socket subscription');
    io.socket.on('move',(data) => {
      console.log(`move socket event captured with ${JSON.stringify(data)}`);
      if (this.id === data.gameId && this.currentFen !== data.fen) {
        this.currentFen = data.fen;
      }
    });
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
      // post the move
      io.socket.post(
        '/api/v1/game/' + this.id + '/move',
        { fen: this.currentFen, _csrf: window.SAILS_LOCALS._csrf },
        (resData, jwRes) => {
          console.log('resData is ' + JSON.stringify(resData));
          console.log('jwRes is ' + JSON.stringify(jwRes));
        });
      // set game to unmovable
      if (this.$refs.echessboard.board.state.movable.color !== undefined
      && this.$refs.echessboard.board.state.movable.color !== ''
      && this.$refs.echessboard.board.state.movable.color !== this.userSide) {
        this.$refs.echessboard.board.state.movable.color = '';
      }
      // emit the move event on the game websocket room
    },

    onPromotion: function(){
      // console.log('onPromotion(data): data is ' + JSON.stringify(data));
    },

    resignGame: function(data) {
      console.log(`resignGame: data is ${JSON.stringify(data)}`);
    },

    showGameSide: function() {
      alert(`You are playing the ${this.userSide} side.`);
    },

    toggleOrientation: function(){
      this.$refs.echessboard.board.toggleOrientation();
    },

  }
});
