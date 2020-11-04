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
    'userSide'
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function (){
    return {
      currentFen: this.fen,
      activeColor: (this.fen.split(' ')[1] === 'w') ? 'White' : 'Black'
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
    <div :name="'board-component-div:' + (name||'')">
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
      <div>
        <label>
          FEN:
          <input type="text" name="fen" v-model="currentFen" size="50">
        </label>
        <label>
          Turn: {{ activeColor }}
        </label>
        <br>
        <label>
          My Side: {{ userSide }}
        </label>
        <br>
        <button @click="changeOrientation">
          Change Orientation
        </button>
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
    console.log('mounted: need to set board non mutable if user is not the activeColor');
    // if (this.$refs.echessboard.board.state.movable.color !== undefined
    // && this.$refs.echessboard.board.state.movable.color !== ''
    // && this.$refs.echessboard.board.state.movable.color !== this.userSide) {
      // this.$refs.echessboard.board.state.movable.color = '';
    // }
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
        function (resData, jwRes) {
          console.log('resData is ' + JSON.stringify(resData));
          console.log('jwRes is ' + JSON.stringify(jwRes));
        });
      // set game to unmovable
      if (this.$refs.echessboard.board.state.movable.color !== undefined
      && this.$refs.echessboard.board.state.movable.color !== ''
      && this.$refs.echessboard.board.state.movable.color !== this.userSide) {
        this.$refs.echessboard.board.state.movable.color = '';
      }
    },

    onPromotion: function(data){
      // console.log('onPromotion(data): data is ' + JSON.stringify(data));
    },

    changeOrientation: function(data){
      // console.log('changeOrientation(data): data is ' + JSON.stringify(data));
      this.$refs.echessboard.board.toggleOrientation();
    },

  }
});
