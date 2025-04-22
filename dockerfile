FROM node:18-alpine

# diretório de trabalho
WORKDIR /app

# dependências
COPY package*.json ./
RUN npm install

# código‑fonte
COPY . .

# a maioria das plataformas (Railway, Render, Heroku…) coloca a porta em $PORT
# mas como fallback usamos 8080
ENV PORT 8080

EXPOSE $PORT

# server dev do Vite, ouvindo em todas as interfaces
# "--host 0.0.0.0" é obrigatório para acessar de fora do container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "$PORT"]