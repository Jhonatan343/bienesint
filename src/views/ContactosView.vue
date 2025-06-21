<template>
  <div class="contact-container">
    <h2>Contacto y Ubicación</h2>
    <div class="info">
      <p><strong>Instituto Nacional de Tecnología</strong></p>
      <p>Dirección: Calle Principal 123, Ciudad, País</p>
      <p>Teléfono: +123 456 7890</p>
      <p>Email: contacto@instituto.edu</p>
      <iframe src="https://www.google.com/maps?q=-34.6037,-58.3816&z=15&output=embed" width="100%" height="250" style="border:0; margin-top:1rem;" allowfullscreen="" loading="lazy"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactosView'
};
</script>

<style scoped>
.contact-container { max-width: 600px; margin: 2rem auto; background: #fff; padding: 2rem; border-radius: 10px; box-shadow: 0 2px 8px #eee; }
.info p { margin: 0.5rem 0; }
</style>
