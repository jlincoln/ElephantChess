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
    'name',
    'free',
    'orientation',
    'showThreats',
    'fen'
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function (){
    return {
      //…
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
    <div :name="'board-component-div:' + (name||'')">
      <chessboard :name="(name||'')" :free="(free === 'true')" :orientation="(orientation||'')" :showThreats="(showThreats === 'true')" fen="rnbqkbnr/pp1ppppp/8/2e5/8/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1" @onMove="onMove" @onPromption="onPromotion(data)">
      </chessboard>
      <div>
        <span>Hello</span>
        {{this.positionInfo}}
        {{this.currentFen}}
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
    //…
  },
  beforeDestroy: function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    onMove: async function(data){
      console.log('onMove(data): data is ' + JSON.stringify(data));
    },

    onPromotion: async function(data){
      console.log('onPromotion(data): data is ' + JSON.stringify(data));
    },

  }
});
