FROM node:18-alpine as builder

WORKDIR /app

COPY . .
# Variável de ambiente

COPY package*.json ./
RUN npm install --package-lock-only
RUN npm ci


# Substitui a variável de ambiente no arquivo environment.ts
RUN node --max-old-space-size=18192 ./node_modules/@angular/cli/bin/ng build --configuration=production --optimization

RUN pwd
RUN ls

# Etapa 2: Servir o aplicativo usando o Nginx
FROM nginx:1.21.1-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/fuse/ /usr/share/nginx/html


