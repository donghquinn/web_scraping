# BBC & Hacker News

## 사전 작업

로컬에 npm/yarn과 prisma를 설치한다
로컬이 아니더라도 작업할 환경에서

```
npm run migrate
```

혹은

```
yarn run migrate
```

를 통해 데이터 베이스 마이그레이션

## 환경변수 설정

각각 서비스 구동에 필요한 환경변수와 db에 사용할 환경변수를 작성한다.

- .env

  > APP_PORT=
  > INTERVAL=
  > DATABASE_URL="postgresql://user:password@DB_SERVER_IP:DB_PORT/DB_NAME?schema=public"

- .postgres.env
  > POSTGRES_USER=user
  > POSTGRES_PASSWORD=password
  > POSTGRES_DB=DB_NAME

## 구동

후에 db 컨테이너 구동

```
sudo docker-compose up -d db
```

그 후에 백엔드 컨테이너 구동

```
sudo docker-compose up -d backend
```
