# Agriculture Logistics

An agriculture logistics management and optimization backend designed to coordinate the movement of agricultural goods across farms, warehouses, roads, and transportation resources.

The system provides REST APIs for managing logistics entities and generating transport plans while keeping the backend modular and maintainable.

## 🚀 Features

* **Farm Management** – Create and manage agricultural farms and their logistics information.
* **Truck Management** – Manage available trucks and transportation resources.
* **Warehouse Management** – Maintain warehouse information and storage locations.
* **Road Management** – Manage road/network information used for transportation planning.
* **Urgency Management** – Handle shipment or transportation urgency requirements.
* **Transport Planning** – Create and manage transport plans connecting agricultural resources with transportation infrastructure.
* **Process Engine** – Provides an API layer for executing logistics-related processing.
* **Health Check API** – Endpoint for checking whether the backend service is running.
* **Centralized Error Handling** – Consistent handling of invalid routes and server errors.
* **Environment-based Configuration** – Uses environment variables for configuration such as the server port and database connection.

## 🛠️ Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**

### Supporting Technologies

* **CORS** – Cross-origin request handling
* **dotenv** – Environment variable management
* **Nodemon** – Development-time server reloads

The backend dependencies and development scripts are defined in `Backend/package.json`.

## 🏗️ Architecture

The backend follows a layered structure that separates responsibilities between routes, controllers, services, repositories, models, validators, and middleware.

```text
Agriculture-Logistics/
│
├── Backend/
│   │
│   ├── config/
│   │   ├── constants.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── farm.controller.js
│   │   ├── processEngine.controller.js
│   │   ├── road.controller.js
│   │   ├── transportPlan.controller.js
│   │   ├── truck.controller.js
│   │   ├── urgency.controller.js
│   │   └── warehouse.controller.js
│   │
│   ├── models/
│   │   ├── farm.model.js
│   │   ├── road.model.js
│   │   ├── transportPlan.model.js
│   │   ├── truck.model.js
│   │   └── warehouse.model.js
│   │
│   ├── repositories/
│   │   ├── farm.repository.js
│   │   ├── road.repository.js
│   │   ├── transportPlan.repository.js
│   │   ├── truck.repository.js
│   │   └── warehouse.repository.js
│   │
│   ├── routes/
│   │   ├── farm.routes.js
│   │   ├── health.routes.js
│   │   ├── processEngine.routes.js
│   │   ├── road.routes.js
│   │   ├── transportPlan.routes.js
│   │   ├── truck.routes.js
│   │   ├── urgency.routes.js
│   │   └── warehouse.routes.js
│   │
│   ├── middlewares/
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── .env.example
│   ├── index.js
│   └── package.json
│
└── README.md
```

The repository currently exposes API route groups for farms, trucks, warehouses, roads, urgency, process execution, and transport plans.

## 🔄 Backend Flow

The application follows a typical layered backend request flow:

```text
Client
   │
   ▼
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
Mongoose Models
   │
   ▼
MongoDB
```

This separation makes the application easier to maintain and allows business logic, database access, and HTTP handling to remain independently organized.

## 📡 API Routes

The backend currently exposes the following route groups:

| Resource        | Base Route             |
| --------------- | ---------------------- |
| Health          | `/api/health`          |
| Farms           | `/api/farms`           |
| Trucks          | `/api/trucks`          |
| Warehouses      | `/api/warehouses`      |
| Roads           | `/api/roads`           |
| Urgency         | `/api/urgency`         |
| Process Engine  | `/api/process`         |
| Transport Plans | `/api/transport-plans` |

These routes are registered in `Backend/index.js`.

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Aditya2584/Agriculture-Logistics.git
cd Agriculture-Logistics
```

### 2. Move into the backend

```bash
cd Backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file using the provided example:

```bash
cp .env.example .env
```

Update the environment variables with your MongoDB configuration.

### 5. Start the development server

```bash
npm run dev
```

For production-style execution:

```bash
npm start
```

The project defines `npm run dev` using Nodemon and `npm start` using Node.js.

By default, the server uses port `5000` unless another port is provided through the environment configuration.

## 🔐 Environment Variables

The project includes a `.env.example` file for environment configuration.

Typical configuration includes:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

> Never commit your real `.env` file or database credentials to GitHub.

## 🧪 API Testing

You can test the REST APIs using tools such as:

* Postman
* Insomnia
* Thunder Client
* cURL

Example health-check request:

```http
GET /api/health
```

Example base URL when running locally:

```text
http://localhost:5000
```

## 📌 Project Goals

The project is intended to provide a backend foundation for an agriculture logistics system where transportation resources and agricultural infrastructure can be represented and coordinated programmatically.

The modular architecture also makes it possible to extend the system with additional optimization logic, authentication, route optimization, real-time tracking, notifications, analytics, and external mapping services.

## 🔮 Future Improvements

Possible extensions include:

* Authentication and role-based access control
* Real-time truck tracking
* Route optimization using graph algorithms
* Automatic truck-to-transport assignment
* Delivery ETA calculation
* Weather and road-condition integration
* Notification and alert systems
* Logistics analytics dashboard
* API documentation using Swagger/OpenAPI
* Automated testing and CI/CD

## 👨‍💻 Author

**Aditya**

GitHub: [@Aditya2584](https://github.com/Aditya2584)

## 📄 License

This project is currently available for educational and development purposes.
