FROM node:lts AS build
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM httpd:2.4 AS runtime
COPY --from=build /app/dist /usr/local/apache2/htdocs/
# Drop-in de cabeceras/caché/gzip (seo-optimization WS3). La imagen httpd:2.4
# no incluye conf-enabled por defecto, así que se agrega el Include explícito.
COPY docker/apache/ogpage.conf /usr/local/apache2/conf/conf-enabled/ogpage.conf
RUN printf '\nInclude conf/conf-enabled/*.conf\n' >> /usr/local/apache2/conf/httpd.conf
EXPOSE 80