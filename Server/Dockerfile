# Build & Publish
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY Server.csproj ./
RUN dotnet restore

# Copy source code and publish
COPY . .
RUN dotnet publish Server.csproj -c Release -o /app/publish --no-restore

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

USER $APP_UID

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Server.dll"]
