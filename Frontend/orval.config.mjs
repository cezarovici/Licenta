export const api = {
  input: {
    target: "http://localhost:8083/v3/api-docs",
  },
  output: {
    mode: "split",
    client: "react-query",
    target: "src/api/endpoints.ts",
    schemas: "src/api/schemas",
    override: {
      mutator: {
        path: "./src/api/axios-instance.ts",
        name: "axiosInstance",
      },
    },
    mock: {
      client: "msw",
      output: "src/api/mocks.ts",
    },
  },
  hooks: {
    after: 'npx prettier --write "src/api/**/*.{ts,tsx}" --log-level "warn"',
  },
};
