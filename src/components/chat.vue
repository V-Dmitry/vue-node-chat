<template>
  <div class="container back">
      <button class='btn out'>Выйти из чата</button>
    <div class="chatroom">
      <div id="window" class="window">
        <ul v-for="message in messages">
          <li class="message">
            <div id="msAuthor">
              {{message.author}}:
            </div>
            <div id="msText">
              {{message.text}}
            </div>
            <div id="msDate">
              {{message.date}}
            </div>
          </li>
        </ul>
      </div>
      <div id="textMessage" class="sendMessage">
        <input class="form-control" type="text" v-model="message">
        <button class='btn' v-on:click="push">Отправить</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default ({
    data() {
      return {
        message: null,
        messages: []
      }
    },

    sockets: {
      connect: function () {
        console.log("is connected")
      }
    },

    methods: {
      push: function () {
        this.$socket.emit('login')
        this.messages.push({
          author: "123",
          text: this.message,
          date: Date.now()
        })
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
