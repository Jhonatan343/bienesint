<template>
  <div class="asset-details-card">
    <h2 class="asset-title">Detalles del Bien</h2>

    <div v-if="asset" class="asset-content">
      <div class="asset-row">
        <span class="label">Nombre:</span>
        <span class="value">{{ asset.name }}</span>
      </div>
      <div class="asset-row">
        <span class="label">Custodio:</span>
        <span class="value">{{ asset.custodian }}</span>
      </div>
      <div class="asset-row">
        <span class="label">Ubicación:</span>
        <span class="value">{{ asset.location }}</span>
      </div>
      <div class="asset-row">
        <span class="label">Descripción:</span>
        <span class="value">{{ asset.description }}</span>
      </div>
      <div class="asset-row">
        <span class="label">Tipo:</span>
        <span class="value">{{ asset.type }}</span>
      </div>
      <div class="asset-row">
        <span class="label">Modelo:</span>
        <span class="value">{{ asset.model }}</span>
      </div>
      <div class="asset-row">
        <span class="label">Estado:</span>
        <span class="value">{{ asset.status }}</span>
      </div>

      <div class="asset-images">
        <div v-if="asset.photoUrl" class="image-block">
          <span class="label">Foto del Bien:</span>
          <img
            :src="asset.photoUrl"
            alt="Foto del Bien"
            class="asset-photo"
          />
        </div>

        <div class="image-block">
          <span class="label">Código QR:</span>
          <img
            :src="generateQRCodeImage(asset.qrCode)"
            alt="Código QR"
            class="asset-qr"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AssetDetails",
  data() {
    return {
      asset: {
        name: "Laptop Lenovo",
        custodian: "Juan Pérez",
        location: "Sala de Administración",
        description: "Laptop en buen estado",
        type: "Electrónica",
        model: "Lenovo ThinkPad X1",
        status: "Activo",
        qrCode: "Laptop-1620732821",
        photoUrl: "https://via.placeholder.com/150",
      },
    };
  },
  methods: {
    generateQRCodeImage(qrCode) {
      return `https://api.qrserver.com/v1/create-qr-code/?data=${qrCode}&size=150x150`;
    },
  },
};
</script>

<style scoped>
.asset-details-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-lg);
  max-width: 600px;
  margin: var(--spacing-lg) auto;
  font-family: var(--font-base);
  color: var(--text-primary);
  transition: var(--transition);
}
.asset-details-card:hover {
  box-shadow: var(--shadow-floating);
  transform: translateY(-3px);
}

/* Título */
.asset-title {
  font-family: var(--font-heading);
  font-size: var(--font-size-lg);
  color: var(--institutional-red);
  margin-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--institutional-red);
  padding-bottom: var(--spacing-xs);
}

/* Contenedor de filas de detalle */
.asset-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* Cada fila: etiqueta + valor */
.asset-row {
  display: flex;
  margin-bottom: var(--spacing-xs);
}

.label {
  width: 120px;
  font-weight: 600;
  color: var(--text-secondary);
}
.value {
  color: var(--text-primary);
}

/* Bloque de imágenes */
.asset-images {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

/* Cada bloque de imagen (foto o QR) */
.image-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.image-block .label {
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
  color: var(--text-secondary);
}

/* Foto del bien */
.asset-photo {
  max-width: 200px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-card);
  transition: var(--transition);
}
.asset-photo:hover {
  box-shadow: var(--shadow-floating);
  transform: translateY(-2px);
}

/* Código QR */
.asset-qr {
  width: 150px;
  height: 150px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-xs);
  background: var(--white);
  transition: var(--transition);
}
.asset-qr:hover {
  border-color: var(--institutional-red);
}

/* Personalización del scrollbar dentro del componente (opcional) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--surface-bg);
  border-radius: var(--border-radius);
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #d1d1d1, #a6a6a6);
  border-radius: var(--border-radius);
  transition: background 0.3s ease;
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--institutional-red), #b30f1b);
}
</style>
