# === Stage 1: Build Frontend (React) ===
FROM node:20-alpine AS web-builder
WORKDIR /app/web

# Copy package.json and yarn.lock (root workspace) helps caching
COPY package.json yarn.lock ./
COPY apps/web-app/package.json ./apps/web-app/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code and build
COPY apps/web-app ./apps/web-app
WORKDIR /app/web/apps/web-app
# "yarn build" runs "tsc -b && vite build" -> output to "dist"
RUN yarn build

# === Stage 2:# Build stage for backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-backend
WORKDIR /src
COPY ["apps/backend/AutoCert.Backend/AutoCert.Backend.csproj", "apps/backend/AutoCert.Backend/"]
RUN dotnet restore "apps/backend/AutoCert.Backend/AutoCert.Backend.csproj"
COPY apps/backend ./apps/backend
WORKDIR "/src/apps/backend/AutoCert.Backend"
RUN dotnet build "AutoCert.Backend.csproj" -c Release -o /app/build

FROM build-backend AS publish
RUN dotnet publish "AutoCert.Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
FROM base AS final
WORKDIR /app
EXPOSE 8080

# Copy backend artifacts
COPY --from=publish /app/publish .

# Copy frontend artifacts to wwwroot (served by UseStaticFiles in Program.cs)
# Ensure the folder structure matches what .NET expects
COPY --from=web-builder /app/web/apps/web-app/dist ./wwwroot

# Environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV DB_PATH=/data/auto-cert.db

# Entry point
ENTRYPOINT ["dotnet", "AutoCert.Backend.dll"]
