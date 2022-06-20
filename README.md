# Bot messages to the amqp

Takes messages from bots and saves in AMQP

## Quick start

Configure and run [nginx-proxy](https://github.com/osnosov/nginx-proxyy)

Download

```console
git clone https://github.com/osnosov/administrator-hook
```

```console
cd administrator-hook
```

Copy .env.example file

```console
cp .env.example .env
```

In the .env file, change the settings for connecting to Redis, PostgreSQL, RabbirtMQ

In the ./.env file, for a variable VIRTUAL_HOST change your host name.
In the ./config/nginx/conf.d/default.conf file, for a variable server_name change your host name

If in the ./.env file change HOST or PORT, then needed in the ./Dockerfile change to the appropriate variable HOST PORT EXPOSE and in the file ./config/nginx/conf.d/default.conf change variable proxy_pass

Run docker-compose

```console
docker-compose up -d
```

Stop docker-compose

```console
docker-compose stop
```
