# Sovereign Ghost Browser - Docker Deployment (V13 Engine)
# Optimized for Always-On Mission Control (Railway / Render / VPS)

FROM mcr.microsoft.com/playwright:v1.42.0-jammy

# 1. System Dependencies for Binary Shredding & Virtual Display
RUN apt-get update && apt-get install -y \
    xvfb \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 2. Application Setup
WORKDIR /app
COPY package*.json ./
RUN npm install

# 3. Source Injection
COPY . .

# 4. Persistence Environment
RUN mkdir -p profiles && chmod 777 profiles

# 5. Execution Environment (VNC/Xvfb Emulation)
# This allows "Headed" browsers to run silently on a headless server.
ENV DISPLAY=:99
ENV NODE_ENV=production

# 6. Start Mission Control
# We use Xvfb to provide a virtual display for the Ghost Launcher.
CMD Xvfb :99 -screen 0 1920x1080x24 & npm start
