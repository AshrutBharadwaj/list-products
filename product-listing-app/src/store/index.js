import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    products: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    hasMore: true,
    filters: {
      search: "",
      sort: "asc",
      inStockOnly: false,
    },
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    setProducts(state, payload) {
      state.products.push(...payload);
      if (payload.length < state.limit) {
        state.hasMore = false;
      }
    },
    resetProducts(state) {
      state.products = [];
      state.page = 1;
      state.hasMore = true;
    },
    incrementPage(state) {
      state.page++;
    },
  },
  actions: {
    async fetchProducts({ commit, state }) {
      commit("setLoading", true);
      commit("setError", null);

      const params = {
        _page: state.page,
        _limit: state.limit,
        q: state.filters.search,
        _sort: "price",
        _order: state.filters.sort,
      };

      try {
        const res = await axios.get("https://dummyjson.com/products");
        let data = res.data.products;
        if (state.filters.search) {
          data = data.filter((product) =>
            product.title
              .toLowerCase()
              .includes(state.filters.search.toLowerCase())
          );
        }

        if (state.filters.inStockOnly) {
          data = data.filter(
            (product) => product.availabilityStatus === "In Stock"
          );
        }

        const paginated = data.slice(
          (state.page - 1) * state.limit,
          state.page * state.limit
        );
        commit("setProducts", paginated);
        commit("incrementPage");
      } catch (error) {
        commit("setError", "Failed to fetch products.");
      } finally {
        commit("setLoading", false);
      }
    },
  },
});
