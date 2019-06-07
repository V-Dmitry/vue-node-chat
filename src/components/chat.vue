<template>
  <div class="container back">
    <button class='btn out' v-on:click="leftChat">Выйти из чата</button>
    <div class="chatroom">
      <div class="users">
        <ul v-for="user in users">
          <li class="user">{{user.username}}</li>
        </ul>
      </div>
      <div id="window" class="window">
        <ul v-for="msg in messages">
          <li class="message">
            <div id="msAuthor">
              {{msg.author}}
            </div>
            <div id="msText">
              {{msg.text}}
            </div>
            <div id="msDate">
              {{msg.date}}
            </div>
          </li>
        </ul>
      </div>
      <div id="textMessage" class="sendMessage">
        <input class="form-control" type="text" v-model="message.text" autofocus>
        <button class='btn' v-on:click="push">Отправить</button>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from "moment"

  export default ({
    data() {
      return {
        message: {
          author: null,
          text: null,
          date: null
        },
        messages: [],
        users: []
      }
    },

    sockets: {
      "connect": function () {
        console.log("socket connected")
      },

      "newMessage": function (message) {
        this.messages.push(message)
      },

      "login": function (messages) {
        this.messages = messages
      },

      "logout": function (message) {
        this.messages.push(message)
      }
    },

    methods: {
      push: function () {
        this.message.author = sessionStorage.getItem('username')
        this.message.date = moment(new Date()).format('YYYY-MM-DD HH:mm')
        this.$socket.emit('new-message', this.message)
        this.resetMessage()
      },

      leftChat: function () {
        this.$socket.emit("logout", sessionStorage.getItem('username'))
        this.$router.push("/login")
      },

      resetMessage: function () {
        this.message.author = null
        this.message.text = null
        this.message.date = null
      }
    }
  })

</script>

<style>
  .chatroom {
    width: 100%;
    max-width: 50rem;
    margin: auto;
    height: 100%;
    border-style: solid;
    border-color: lightgray;
  }

  .sendMessage {
    display: flex;
  }

  #window {
    min-height: 62.5rem;
    max-height: 50rem;
    background-color: cornsilk;
    overflow-y: auto;
  }

  .message {
    max-width: 30rem;
    background-color: lightgray;
    border-radius: .5rem;
  }

  #msAuthor {
    font-weight: bold;
    font-size: 1.3rem;
  }

  #msText {
    font-size: 1.6rem;
  }

  #msDate {
    font-size: .9rem;
  }

  .out {
    float: right;
  }

  .back {
    width: 100%;
    height: 100%;
  }

</style>
