# Базовий образ Playwright
FROM mcr.microsoft.com/playwright:v1.43.1-jammy

# Робоча директорія
WORKDIR /universeTestTask/spec

# Копіюємо package.json та встановлюємо залежності
COPY package*.json ./
RUN npm install

# Додаємо http-server для серва HTML-репорту
RUN npm install -g http-server

# Копіюємо решту проєкту
COPY . .

# Компіляція TS, якщо треба
RUN npx tsc || true

# Запускаємо тести та піднімаємо сервер на 8080
CMD npx playwright test --reporter=html && http-server playwright-report -p 8080
