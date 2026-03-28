## ---- Builder stage ----
FROM maven:3.8.3-openjdk-17 AS builder

# Создаем папку для настроек Maven
RUN mkdir -p /root/.m2

# Добавляем зеркала для Maven (китайские и российские зеркала)
RUN echo '<?xml version="1.0" encoding="UTF-8"?> \
  <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" \
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd"> \
  <mirrors> \
  <!-- Aliyun mirror (быстрый, Китай) --> \
  <mirror> \
  <id>aliyun-maven</id> \
  <name>Aliyun Maven Mirror</name> \
  <url>https://maven.aliyun.com/repository/public</url> \
  <mirrorOf>central</mirrorOf> \
  </mirror> \
  <!-- Tencent mirror (Китай) --> \
  <mirror> \
  <id>tencent-maven</id> \
  <name>Tencent Maven Mirror</name> \
  <url>https://mirrors.tencent.com/nexus/repository/maven-public/</url> \
  <mirrorOf>central</mirrorOf> \
  </mirror> \
  <!-- Huawei mirror (Китай) --> \
  <mirror> \
  <id>huaweicloud-maven</id> \
  <name>HuaweiCloud Maven Mirror</name> \
  <url>https://repo.huaweicloud.com/repository/maven/</url> \
  <mirrorOf>central</mirrorOf> \
  </mirror> \
  </mirrors> \
  <!-- Добавляем настройки для отключения SSL проверки (если нужно) --> \
  <profiles> \
  <profile> \
  <id>insecure</id> \
  <properties> \
  <maven.wagon.http.ssl.insecure>true</maven.wagon.http.ssl.insecure> \
  <maven.wagon.http.ssl.allowall>true</maven.wagon.http.ssl.allowall> \
  <maven.wagon.http.ssl.ignore.validity.dates>true</maven.wagon.http.ssl.ignore.validity.dates> \
  </properties> \
  </profile> \
  </profiles> \
  <activeProfiles> \
  <activeProfile>insecure</activeProfile> \
  </activeProfiles> \
  </settings>' > /root/.m2/settings.xml

WORKDIR /build
COPY pom.xml .

# Загружаем зависимости с новыми зеркалами и отключенным SSL
RUN mvn dependency:go-offline -B -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true -Dmaven.wagon.http.ssl.ignore.validity.dates=true

COPY src ./src

# Собираем проект с отключенной проверкой SSL
RUN mvn clean package -DskipTests -e -X -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true -Dmaven.wagon.http.ssl.ignore.validity.dates=true

FROM eclipse-temurin:17-jre-alpine

RUN addgroup -g 1001 -S appuser && adduser -u 1001 -S appuser -G appuser

WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar

USER appuser

EXPOSE 8181
ENTRYPOINT ["java", "-jar", "app.jar"]