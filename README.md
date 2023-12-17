! MERN ecommerce backend

! Run with code

!! Clone the repo with

```shell
git clone https://github.com/Bikram-ghuku/ecommerce_server
```

!! Make a .env file

```.env
PORT = <PORT_FOR_SERVER>
MONGO_URI = <MONGO_DB_SERVER_URL>
STRIPE_SK_KEY = <STRIPE_SECRET_KEY>
STRIPE_PU_KEY = <STRIPE_PUBLIC_KEY>
```

!! Run the server

```shell
npm start
```

! Run with docker

!! Pull the image

```shell
docker pull bikramghuku05/ecommerce_server
```

```shell
docker run -p 8080:<PCPORT> -e PORT=8080 \
-e MONGO_URI=<MONGO DB URI> \
-e STRIPE_SK_KEY=<STRIPE-SECRET-KEY> \
-e STRIPE_PU_KEY=<STRIPE-PUBLIC-KEY> 
bikramghuku05/ecommerce_server
```