# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copie os arquivos do projeto para o diretório de trabalho
COPY . .

# Compile o projeto TypeScript
RUN npm run build

# Exponha a porta em que o servidor MCP será executado
EXPOSE 3839

# Comando para iniciar o servidor
CMD ["node", "dist/index.js"]