<template>
  <div class="card">
    <img :src="product.images[0]" :alt="product.title" class="card-image" />
    <div class="card-body">
      <h2 class="card-title">{{ product.title }}</h2>
      <p class="card-price">\${{ product.price.toFixed(2) }}</p>
      <p class="card-stock" :class="product.availabilityStatus === 'Out of Stock' ? 'out-of-stock' : product.availabilityStatus === 'Low Stock' ? 'low-in-stock' : 'card-stock'">
        {{ product.availabilityStatus }}
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
