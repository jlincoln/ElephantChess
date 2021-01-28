/**
 * game-chat
 * -----------------------------------------------------------------------------
 * A new component
 *
 * @type {Component}
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('game-chat', {

  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'gameId',
    'chats',
    'opponent',
    'userId'
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function (){
    return {
      message: '',
      chatMessages: this.chats,
      hasJoinedRoom: false,
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
    <div :id="'chat-component-div-' + gameId">
        <div class="panel panel-default">
          <div class="panel-heading lead" style="background-color: lightgrey; border-color: black; text-align: center;">
            <i class="fa fa-comment-o"></i> Messages
          </div>
          <div class="panel-body" style="max-height: 356px; overflow-y: scroll;">
            <ul class="chat-window" style="border-color: lightgrey; border-style: solid; border-width: thin;">
              <li class="chat clearfix" style="font-size: 11px" v-for="chatMessage in chatMessages">
                <div class="chat-body">
                  <div class="header">
                    <small class="pull-right" style="padding-right: 2px;">
                      {{
                        ((new Date(chatMessage.createdAt).toLocaleDateString()) + ' ' + (new Date(chatMessage.createdAt).toLocaleTimeString()))
                      }}
                    </small>
                  </div>
                  <p class="message">
                    <strong>{{ (chatMessage.sender === userId) ? "me: " : opponent.split(" ")[0] + ": " }}</strong> {{ chatMessage.message }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div class="panel-footer">
            <div class="input-group mb-3">
              <input
                :id="'chatMessage-'+gameId"
                type="text"
                class="form-control"
                placeholder="Type your message here..."
                aria-label="message"
                aria-describedby="basic-addon2"
                v-model="message"
                @keyup.enter="sendMessage()"
                @keypress="whenTyping($event)"
                @focus="whenTyping($event)"
                @blur="whenNotTyping($event)"
                @disabled="">
              <div class="input-group-append">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="sendMessage()"
                  title="Send message"
                  :disabled="!hasJoinedRoom">Send
                </button>
              </div>
            </div>
          </div>
        </div><!-- class="panel panel-primary" -->
    </div>
    `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {

  },

  mounted: function (){
    if (!this.hasJoinedRoom) {
      // join game chat room
      io.socket.put('/api/v1/game/' + this.gameId + '/join-chat',
          {
            _csrf: window.SAILS_LOCALS._csrf
          },
          () => {
          // (resData, jwRes) => {
            // console.log('mounted: join-chat resData is ' + JSON.stringify(resData));
            // console.log('mounted: join-chat jwRes is ' + JSON.stringify(jwRes));
            this.hasJoinedRoom = true;
          }
      );
    }
    // listen to websocket game chat room
    io.socket.on(`game-chat:${this.gameId}`,(data) => {
      if (data.game === this.gameId) {
        this.chatMessages.unshift(data);
      }
    });
    // listen to websocket game chat room for typing event
    io.socket.on('typing',(data) => {
      console.log(`typing socket event captured with ${JSON.stringify(data)}`);
    });
    // listen to websocket game chat room for stopped typing event
    io.socket.on('stoppedTyping',(data) => {
      console.log(`typing socket event captured with ${JSON.stringify(data)}`);
    });
  },

  beforeDestroy: function() {

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    sendMessage: function() {
      if (this.message === '') { return; }
      io.socket.post('/api/v1/game/' + this.gameId + '/chat',
        {
          message: this.message,
          _csrf: window.SAILS_LOCALS._csrf
        },
        () => {
        // (resData, jwRes) => {
          this.message = '';
          document.getElementById('chatMessage-'+this.gameId).focus();
        }
      );
    },

    whenTyping: function(event) {
      console.log(`whenTyping: event is ${event}`);
    },

    whenNotTyping: function(event) {
      console.log(`whenNotTyping: event is ${event}`);
    },


  },

});
