import createFetchClient, { type Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";

import type { paths } from "../api.generated";

/**
 * Middleware pentru a adăuga token-ul de autentificare la headere.
 */
const addTokenHeader: Middleware = {
  async onRequest({ request }) {
    // Presupunem că token-ul este salvat în localStorage
    const token = localStorage.getItem("token");
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
};

const client = createFetchClient<paths>({
  baseUrl: "http://localhost:8080/",
});

// 2. Aplicăm middleware-ul
client.use(addTokenHeader);

// 3. Creăm wrapper-ul pentru React Query
export const api = createClient(client);
