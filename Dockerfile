
FROM node:lts-alpine3.22

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e instala as dependências
COPY package*.json ./
RUN npm install

COPY prisma ./prisma

# Copia o restante do código para dentro do container
COPY . .

# Compila o código TypeScript
RUN npx prisma generate
RUN npm run build

RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

EXPOSE 3333

# Comando para rodar a aplicação
CMD ["npm","run", "start"]