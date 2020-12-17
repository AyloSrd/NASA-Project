FROM hayd/deno:alpine-1.5.2

WORKDIR /app

COPY . . 

USER deno

CMD ["run", "--allow-read", "--allow-net", "src/mod.ts"]

EXPOSE 8000