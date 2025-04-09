<template>
  <transition name="fade-scale">
    <div class="product-card">
      <div class="image-wrapper">
        <img
          :src="product.thumbnail"
          :alt="product.title"
          loading="lazy"
          @load="loaded = true"
          :class="{ loaded }"
        />
      </div>
      <h3 class="title">{{ product.title }}</h3>
      <p class="price">${{ product.price }}</p>
      <p
        class="card-stock"
        :class="
          product.availabilityStatus === 'Out of Stock'
            ? 'out-of-stock'
            : product.availabilityStatus === 'Low Stock'
            ? 'low-in-stock'
            : 'card-stock'
        "
      >
        {{ product.availabilityStatus }}
      </p>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const loaded = ref(false);
</script>
