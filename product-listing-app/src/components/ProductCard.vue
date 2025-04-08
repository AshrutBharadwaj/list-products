<template>
  <div class="card">
    <img :src="product.image" :alt="product.name" class="card-image" />
    <div class="card-body">
      <h2 class="card-title">{{ product.name }}</h2>
      <p class="card-price">\${{ product.price.toFixed(2) }}</p>
      <p class="card-stock" :class="{ 'out-of-stock': !product.inStock }">
        {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>
