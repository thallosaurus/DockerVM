FROM node:16

HEALTHCHECK --interval=5s CMD curl -f http://localhost:8085/health || exit 1

WORKDIR /app
ENV BOOTSTRAP="tail -f /dev/random"
ENV NETWORK_ID=vm_net
LABEL traefik.http.routers.mainpage.entrypoints=websecure
LABEL traefik.http.routers.mainpage.tls=true
LABEL traefik.http.routers.mainpage.tls.certresolver=myresolver
LABEL traefik.port=8085
COPY . .
RUN yarn
CMD ["yarn", "prod"]
EXPOSE 8085
