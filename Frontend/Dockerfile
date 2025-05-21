FROM node:lts AS base
WORKDIR /app

# Copy only the necessary files to leverage caching
COPY ./Frontend/package.json ./Frontend/package-lock.json ./

FROM base AS prod-deps
RUN npm install --omit=dev

FROM base AS build-deps
RUN npm install

FROM build-deps AS build
COPY ./Frontend/ . 
# Copy the whole project, including src files
RUN npm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

# Fix the path to match Astro's SSR output
CMD node ./dist/server/entry.mjs
