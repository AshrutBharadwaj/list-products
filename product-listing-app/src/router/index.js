import { createRouter, createWebHistory } from "vue-router";
import ProductList from "../views/ProductList.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: ProductList,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
