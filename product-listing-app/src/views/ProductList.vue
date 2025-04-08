<template>
  <div class="container">
    <header class="header">
      <img src="../../public/vite.svg" alt="App Logo" class="logo" />
      <h1 class="product-name">Vue Product Explorer</h1>
    </header>
    <div class="filters">
      <input
        v-model="filters.search"
        type="text"
        placeholder="Search by name"
        class="input"
      />
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

    <div v-if="!filteredProducts.length && !loading && !error" class="no-results">
      No products found.
    </div>

    <div v-else class="grid">
      <component
        v-for="product in filteredProducts"
        :is="ProductCard"
        :key="product.id"
        :product="product"
      />
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
import {
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  ref,
  defineAsyncComponent,
} from "vue";
import { useStore } from "vuex";
import debounce from "lodash.debounce";

const store = useStore();
const ProductCard = defineAsyncComponent({
  loader: () => import("../components/ProductCard.vue"),
  loadingComponent: {
    template: '<div class="skeleton-card">Loading...</div>',
  },
  delay: 200,
});
const products = computed(() => store.state.products);
const loading = computed(() => store.state.loading);
const filters = computed(() => store.state.filters);
const hasMore = computed(() => store.state.hasMore);
const error = computed(() => store.state.error);
const sentinel = ref(null);

const filteredProducts = computed(() => {
  let result = [...products.value];

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    result = result.filter(product => product.title.toLowerCase().includes(searchTerm));
  }

  if (filters.value.inStockOnly) {
    result = result.filter(product => product.stock > 0);
  }

  if (filters.value.sort === 'asc') {
    result = result.slice().sort((a, b) => a.price - b.price);
  } else if (filters.value.sort === 'desc') {
    result = result.slice().sort((a, b) => b.price - a.price);
  }

  return result;
});

const fetchProducts = () => {
  if (!loading.value && hasMore.value) {
    store.dispatch("fetchProducts");
  }
};

const resetAndFetch = () => {
  store.commit("resetProducts");
  fetchProducts();
};

const debouncedResetAndFetch = debounce(resetAndFetch, 400);

watch(
  () => ({
    search: filters.value.search,
    inStockOnly: filters.value.inStockOnly
  }),
  () => {
    debouncedResetAndFetch();
  },
  { deep: true }
);


let observer;

onMounted(() => {
  fetchProducts();

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading.value && hasMore.value) {
        fetchProducts();
      }
    },
    {
      rootMargin: "100px",
    }
  );

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
