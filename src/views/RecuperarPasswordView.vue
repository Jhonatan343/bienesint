<template>
  <div class="recover-container">
    <h2>Recuperar Contraseña</h2>
    <form @submit.prevent="tokenSent ? handleReset() : handleSubmit()">
      <div v-if="!tokenSent">
        <label for="email">Correo institucional</label>
        <input id="email" v-model="email" type="email" required />
        <button type="submit">Enviar token</button>
      </div>
      <div v-else>
        <label for="token">Token recibido</label>
        <input id="token" v-model="token" required />
        <label for="newPassword">Nueva contraseña</label>
        <input id="newPassword" v-model="newPassword" type="password" required />
        <button type="submit">Restablecer contraseña</button>
      </div>
      <div v-if="message" class="message">{{ message }}</div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { authService } from '@/services/auth.js';

export default {
  name: 'RecuperarPasswordView',
  setup() {
    const email = ref('');
    const token = ref('');
    const newPassword = ref('');
    const tokenSent = ref(false);
    const message = ref('');
    const cedulaToken = ref('');

    const handleSubmit = async () => {
      // Buscar usuario por correo y enviar token (número de cédula)
      const result = await authService.sendRecoveryToken(email.value);
      if (result.success) {
        cedulaToken.value = result.token; // El token es la cédula
        tokenSent.value = true;
        message.value = 'Se ha enviado un token a su correo institucional.';
      } else {
        message.value = result.message;
      }
    };
    const handleReset = async () => {
      // El token correcto es la cédula
      if (token.value === cedulaToken.value) {
        const result = await authService.resetPassword({ email: email.value, newPassword: newPassword.value });
        if (result.success) {
          message.value = 'Contraseña restablecida correctamente.';
        } else {
          message.value = result.message;
        }
      } else {
        message.value = 'Token incorrecto. Verifica el correo.';
      }
    };
    return { email, token, newPassword, tokenSent, message, handleSubmit, handleReset };
  }
};
</script>

<style scoped>
.recover-container { max-width: 400px; margin: 2rem auto; background: #fff; padding: 2rem; border-radius: 10px; box-shadow: 0 2px 8px #eee; }
label { display: block; margin-top: 1rem; }
input { width: 100%; padding: 0.5rem; margin-top: 0.5rem; }
button { margin-top: 1.5rem; width: 100%; background: #ef4444; color: #fff; border: none; padding: 0.7rem; border-radius: 5px; cursor: pointer; }
.message { margin-top: 1rem; color: #10b981; }
</style>
