<template>
  <div class="container">
    <div class="filters">
      <input v-model="filters.search" type="text" placeholder="Search by name" class="input" />
      <select v-model="filters.sort" class="select">
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>
      <label>
        <input type="checkbox" v-model="filters.inStockOnly" />
        <span>In Stock Only</span>
      </label>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!products.length && !loading && !error" class="no-results">
      No products found.
    </div>

    <div v-else class="grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>

    <div ref="sentinel" class="loading-container">
      <div v-if="loading" class="loading">
        <span class="spinner"></span>
        <span>Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed, watch, ref } from 'vue';
import { useStore } from 'vuex';
import ProductCard from '../components/ProductCard.vue';
import debounce from 'lodash.debounce';

const store = useStore();

const products = computed(() => store.state.products);
const loading = computed(() => store.state.loading);
const filters = computed(() => store.state.filters);
const hasMore = computed(() => store.state.hasMore);
const error = computed(() => store.state.error);
const sentinel = ref(null);

const fetchProducts = () => {
  if (!loading.value && hasMore.value) {
    store.dispatch('fetchProducts');
  }
};

const resetAndFetch = () => {
  store.commit('resetProducts');
  fetchProducts();
};

const debouncedResetAndFetch = debounce(resetAndFetch, 400);

watch(
  () => ({ ...filters.value }),
  () => {
    debouncedResetAndFetch();
  },
  { deep: true }
);

let observer;

onMounted(() => {
  fetchProducts();

  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading.value && hasMore.value) {
      fetchProducts();
    }
  }, {
    rootMargin: '100px'
  });

  if (sentinel.value) {
    observer.observe(sentinel.value);
  }
});

onBeforeUnmount(() => {
  if (observer && sentinel.value) {
    observer.unobserve(sentinel.value);
  }
});
</script>
