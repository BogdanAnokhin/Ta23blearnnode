<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        {{ msg.text }}
      </div>
    </div>
    <input v-model="message" @keyup.enter="sendMessage" placeholder="Введите сообщение">
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const message = ref('');
const messages = ref([]);
const socket = ref(null);

// Инициализация WebSocket
const initWebSocket = () => {
  socket.value = new WebSocket("ws://localhost:8080");

  socket.value.addEventListener("open", (event) => {
    console.log("WebSocket соединение установлено");
  });

  socket.value.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'messages') {
        messages.value = [...data.messages]; // Полная замена истории
      } else if (data.type === 'message') {
        messages.value.push(data); // Добавление нового сообщения
      }
    } catch (e) {
      console.error("Ошибка парсинга сообщения:", e);
    }
  });

  socket.value.addEventListener("error", (error) => {
    console.error("WebSocket ошибка:", error);
  });

  socket.value.addEventListener("close", () => {
    console.log("WebSocket соединение закрыто");
  });
};

// Отправка сообщения
const sendMessage = () => {
  if (message.value.trim() && socket.value?.readyState === WebSocket.OPEN) {
    socket.value.send(JSON.stringify({
      text: message.value,
      date: new Date().toISOString()
    }));
    message.value = '';
  }
};

// Жизненный цикл компонента
onMounted(() => {
  initWebSocket();
});

onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.close();
  }
});
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.messages {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
}

.message {
  margin-bottom: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>