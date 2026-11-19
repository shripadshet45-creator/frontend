FROM nginxinc/nginx-unprivileged:1.27-alpine

LABEL com.azure.containerizationassist.createdby="containerization-assist"

COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:8080/health || exit 1

USER 101

CMD ["nginx", "-g", "daemon off;"]
