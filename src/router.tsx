import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Chave nova a cada carregamento: o roteador não restaura posições de visitas antigas
// (quem controla "recarregar mantém / entrar de novo começa no topo" é o script do __root).
const loadId = Math.random().toString(36).slice(2);
const scrollKeyOption = {
  getScrollRestorationKey: (l: { href: string }) => `${loadId}:${l.href}`,
};

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    ...(scrollKeyOption as object),
    defaultPreloadStaleTime: 0,
  });

  return router;
};
