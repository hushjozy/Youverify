## Inventory Order Microservice

This is an Inventory Order Microservice built with Node.js and TypeScript that uses MongoDB for data storage, RabbitMQ for messaging, Elasticsearch for logging, and Winston for structured logging integrated with Kibana. The service manages order creation and inventory checks.

## Features/Technologies

MongoDB: For storing order and inventory data.
RabbitMQ: For communication between the Inventory and Order microservices.
Elasticsearch: For centralized logging and monitoring with Kibana.
Winston: For structured logging and logging to Elasticsearch.
Unit Tests: To ensure the business logic functions correctly.
E2E Tests: To simulate end-to-end workflows.

## Prerequisites

Before running the service, make sure you have the following installed:

Docker (for local development and running services like MongoDB, RabbitMQ, Elasticsearch, and Kibana)
Node.js (v14 or higher)
Yarn or npm (for managing dependencies)
TypeScript (for compiling the code)

## Installation

Clone the repository and install dependencies:

bash

git clone the repo
cd inventory-order-microservice
run npm install

## Docker Compose Setup

Ensure you have the necessary Docker services running for MongoDB, RabbitMQ, Elasticsearch, and Kibana. You can use the following docker-compose.yml to set up these services locally . credentials are changable depending on environments.

## Configuration

Create a .env file in the root of the project to define environment variables:

env

MONGO_URI=mongodb://root:passVerify@mongodb:27017/youVerify
RABBITMQ_URI=amqp://guest:guest@rabbitmq:5672
ELASTICSEARCH_URI=http://elasticsearch:9200
and PORT=3000 for inventory and PORT=4000 for order

## Start All the services with Docker Compose:

`docker-compose up --build`

This will bring up MongoDB, RabbitMQ, Elasticsearch, Kibana, Order and Inventory services.

## API Endpoints

## ORDER ENDPOINTS

## Create Order

_POST /orders/create_

## REQUEST:

json

{
"itemId": "item123",
"quantity": 2
}

## RESPONSE:

json

{
"orderId": "order123",
"success":true,
"status": "CREATED"
}

If Quantity of order exceeds stockQuantity Available

## RESPONSE:

json

{
"orderId": "order123",
"success":false,
"status": "Insufficient stock"
}

## Get Order

_GET orders/getOrders/672e4b235bb72da46dd5496a_

## RESPONSE :

{
"\_id": "672e4b235bb72da46dd5496a",
"itemId": "672de5efa3dccf3d22f21593",
"quantity": 1,
"status": "CREATED",
"\_v": 0
}

## INVENTORY ENDPOINTS

## Create Inventory Item

_POST inventory/items_

This endpoint communicates with the Inventory service via RabbitMQ to check if the requested stock is available.

## REQUEST Body:

json

{
"itemId": "item123",
"description":"sample desc",
"price":100,
"stockQuantity": 100
}

## RESPONSE:

json

{
"status": "success",
"itemId": "item123",
"quantity": 2,
}
If the stock is insufficient, the response would be:

json

{
"status": "insufficient stock",
"success": false,
}

## Update Inventory Item Stock

_PATCH inventory/items/:id/stock_

This endpoint communicates with the Inventory service to modify the requested item stockQuantity available.

## REQUEST Body:

json

{"stockQuantity":408}

RESPONSE:

{
"\_id": "672de5efa3dccf3d22f21593",
"name": "Spaghetti",
"description": "Indian made spaghtetti",
"stockQuantity": 408,
"\_v": 0
}

## Get Inventory Item

_GET inventory/items/672de5efa3dccf3d22f21593_

## RESPONSE :

{
"\_id": "672de5efa3dccf3d22f21593",
"name": "Spaghetti",
"description": "Indian made spaghtetti",
"stockQuantity": 408,
"\_v": 0
}
Logging
The service uses Winston for logging and stores logs in Elasticsearch for querying and visualization in Kibana.

Log Example
Winston logs in JSON format:

json

{
"message": "Stock updated for itemId: item123",
"level": "info",
"timestamp": "2023-10-01T00:00:00Z"
}
You can view logs in Kibana at http://localhost:5601.

TESTING
Unit Tests
Unit tests are written using Jest to test business logic such as stock checking, order creation, etc.

Run unit tests with:

bash

in Inventory Service root run `npx run jest`

E2E Tests
End-to-end tests simulate full workflows, including creating an order and checking stock via RabbitMQ.

in Order service run `npx jest /tests/e2eOrder.test.ts`

## E2E test are set to run with test mongoserver ,

Make sure the microservice and required services (MongoDB, RabbitMQ, Elasticsearch) are running before executing the E2E tests.

Troubleshooting
If MongoDB fails to connect, ensure that the MongoDB container is running and that the correct URI is in your .env file.
If RabbitMQ is not processing messages, verify that RabbitMQ is running and that the microservice is correctly connected to the queue.
If you encounter issues with Elasticsearch, ensure that the Elasticsearch container is accessible at the correct URI and generate token for authentication
