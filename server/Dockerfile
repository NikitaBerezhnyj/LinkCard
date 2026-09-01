FROM mcr.microsoft.com/dotnet/sdk:9.0

WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

COPY . .

ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "watch", "run", "--no-launch-profile", "--urls", "http://0.0.0.0:8080"]