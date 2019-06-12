<template>
  <div class="container back">
    <button class='btn out' v-on:click="leftChat">Выйти из чата</button>
    <div class="chatroom row">
      <div class="users col-md-3">
        <p class="usersTitle">Пользователи в чате</p>
        <ul v-for="user in users">
          <li class="user">{{user.username}}</li>
        </ul>
      </div>
      <div class="window col-md-6">
        <div id="messages" class="messages">
          <ul v-for="msg in messages">
            <li class="message">
              <div id="msAuthor">
                {{msg.author}}
              </div>
              <div id="msText">
                {{msg.text}}
              </div>
              <div id="msDate">
                {{moment(msg.date).format('YYYY-MM-DD HH:mm')}}
              </div>
            </li>
          </ul>
        </div>
        <div id="textMessage" class="sendMessage">
          <input class="form-control" type="text" v-on:keyup.enter="push" v-model="message.text" autofocus>
          <button class='btn' v-on:click="push">Отправить</button>
        </div>
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
        users: [],
        moment: moment
      }
    },

    sockets: {
      "connect": function () {
        this.$socket.emit('update')
      },

      "update": function (data) {
        this.mesasges = data.messages
        this.users = data.users
      },

      "new-message": function (message) {
        this.messages.push(message)
      },

      "get-users": function(users) {
        this.users = users
      },

      "login": function (msgList) {
        this.messages = msgList
      },

      "user-logout": function(message) {
        this.messages.push(message)
      },
    },

    methods: {
      push: function () {
        if (!this.message.text) alert('Введите сообщение')
        else {
          this.message.author = sessionStorage.getItem('username')
          this.message.date = moment(new Date()).format('YYYY-MM-DD HH:mm')
          this.$socket.emit('new-message', this.message)
          this.resetMessage()
        }
      },

      leftChat: function () {
        this.messages = []
        this.resetMessage()
        sessionStorage.removeItem('token')
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
    margin: auto;
    height: 100%;
  }

  .sendMessage {
    display: flex;
  }

  #messages {
    min-height: 62.5rem;
    max-height: 62.5rem;
    background-color: cornsilk;
    overflow-y: auto;
    border-style:groove;
  }

  .message {
    max-width: 30rem;
    background-color: lightgray;
    border-radius: .5rem;
    padding: .5rem .5rem .5rem .5rem;
  }

  #msAuthor {
    font-weight: bold;
    font-size: 1.3rem;
    margin-left:1rem; 
  }

  #msText {
    font-size: 1.6rem;
    margin-left:1rem;
  }

  #msDate {
    font-size: .9rem;
    margin-left:1rem;
  }

  .out {
    float: right;
  }

  .back {
    width: 100%;
    height: 100%;
  }

  .usersTitle {
    margin-left:1rem;
  }

  .users {
    margin: auto;
  }

</style>
