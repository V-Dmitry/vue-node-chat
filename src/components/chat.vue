<template>
  <div class="chatroom">
    <div id="window" class="window">
      <ul v-for="message in messages">
        <li class="message">
          <div id="msAuthor">
            {{message.author}}
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
      <button class='btn '>Отправить</button>
    </div>
  </div>
</template>

<script>
  import socket from '@/main.js'

  export default ({
    data() {
      return {
        message: null,
        messages: []
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
    border-color: aqua;
  }

  .sendMessage {
    display: flex;
  }

  #window {
    min-height: 50rem;
    background-color: lightgray;
  }

  .message {
    max-width: 5rem;
    background-color: lightseagreen;
    border-radius: .5rem;
  }

</style>
