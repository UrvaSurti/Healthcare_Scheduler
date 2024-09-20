# Healthcare Appointment Scheduler API

This API allows users to manage appointments with healthcare providers. It includes endpoints for creating, updating, and deleting appointments, as well as retrieving provider and appointment information.

## Table of Contents
1. [Installation](#installation)
2. [Running the Project](#running-the-project)
3. [API Endpoints](#api-endpoints)
   - [Create Appointment](#create-appointment)
   - [Get All Appointments](#get-all-appointments)
   - [Get Appointment by Email](#get-appointment-by-email)
   - [Get Appointment by Provider](#get-appointment-by-provider)
   - [Get Appointment by Email and Provider](#get-appointment-by-email-and-provider)
   - [Reschedule Appointment](#reschedule-appointment)
   - [Delete Appointment](#delete-appointment)
   - [Get All Providers](#get-all-providers)

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd healthcare-appointment-scheduler
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Create a `.env.local` file for your environment variables, and include a value for the `JWT_SECRET`:
   ```bash
   JWT_SECRET=your-secret-key
   ```

## Running the Project

To start the server, run:

```bash
npm run dev
```

This will start the server on `http://localhost:3001` (or the port specified in your `.env` file).

---

## API Endpoints 
 
### 1. Create Appointment

**Endpoint**: `POST /api/appointments`

- **Description**: Create a new appointment for a healthcare provider.
- **Request Body**:
  ```json
  {
    "providerId": "3",
    "dateTime": "2024-09-20T14:00",
    "userEmail": "user@example.com"
  }
  ```
- **Response**:
  - `201 Created`: Appointment successfully created.
  - `400 Bad Request`: Missing required fields or invalid data.
  - `500 Internal Server Error`: Server error.

---

### 2. Get All Appointments

**Endpoint**: `GET /api/appointments`

- **Description**: Retrieve all appointments.
- **Response**:
  - `200 OK`: List of all appointments.
  - `500 Internal Server Error`: Server error.

---

### 3. Get Appointment by Email

**Endpoint**: `GET /api/appointments?userEmail=user@example.com`

- **Description**: Retrieve appointments based on the user's email.
- **Query Parameters**:
  - `userEmail`: The email address of the user.
- **Response**:
  - `200 OK`: List of appointments for the given email.
  - `500 Internal Server Error`: Server error.

---

### 4. Get Appointment by Provider

**Endpoint**: `GET /api/appointments?providerId=2`

- **Description**: Retrieve appointments based on the provider's ID.
- **Query Parameters**:
  - `providerId`: The ID of the healthcare provider.
- **Response**:
  - `200 OK`: List of appointments for the given provider.
  - `500 Internal Server Error`: Server error.

---

### 5. Get Appointment by Email and Provider

**Endpoint**: `GET /api/appointments?userEmail=user@example.com&providerId=2`

- **Description**: Retrieve appointments based on both the user's email and the provider's ID.
- **Query Parameters**:
  - `userEmail`: The email address of the user.
  - `providerId`: The ID of the healthcare provider.
- **Response**:
  - `200 OK`: List of appointments matching the email and provider.
  - `500 Internal Server Error`: Server error.

---

### 6. Reschedule Appointment

**Endpoint**: `PUT /api/appointments`

- **Description**: Reschedule an appointment by updating the appointment date and time.
- **Request Body**:
  ```json
  {
    "reservationCode": "c517acab-d6fe-47e0-8b69-c5ec7b814560",
    "newDateTime": "2024-09-11T14:00"
  }
  ```
- **Response**:
  - `200 OK`: Appointment successfully rescheduled.
  - `400 Bad Request`: Missing required fields or invalid data.
  - `404 Not Found`: Appointment not found.
  - `500 Internal Server Error`: Server error.

---

### 7. Delete Appointment

**Endpoint**: `DELETE /api/appointments`

- **Description**: Cancel an existing appointment.
- **Request Body**:
  ```json
  {
    "reservationCode": "c517acab-d6fe-47e0-8b69-c5ec7b814560"
  }
  ```
- **Response**:
  - `200 OK`: Appointment successfully canceled.
  - `400 Bad Request`: Missing reservation code.
  - `404 Not Found`: Appointment not found.
  - `500 Internal Server Error`: Server error.

---

### 8. Get All Providers

**Endpoint**: `GET /api/providers`

- **Description**: Retrieve a list of all healthcare providers.
- **Response**:
  - `200 OK`: List of all providers.
  - `500 Internal Server Error`: Server error.

---

# Postman Collection

For your convenience, a Postman collection named **"Healthcare Scheduler.postman_collection.json"** is included in the repository. This collection provides predefined requests for all the API endpoints described above, making it easy to test the API.

### How to Use the Postman Collection:

1. Open [Postman](https://www.postman.com/downloads/).
2. In Postman, click on **Import**.
3. Select the file **Healthcare Scheduler.postman_collection.json** from the repository.
4. The collection with all the available API requests will be imported and ready for use.

This collection includes examples of:
- Creating, fetching, rescheduling, and deleting appointments.
- Fetching providers and available times.
- User registration and login.

---

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages based on the outcome of the request. Common errors include:
- `400 Bad Request`: The request contains invalid or missing parameters.
- `404 Not Found`: The requested resource (e.g., appointment, provider) could not be found.
- `500 Internal Server Error`: A server-side error occurred.

---

## Authentication

Authentication for users is managed via JWT (JSON Web Tokens). Tokens must be included in the `Authorization` header for protected routes such as fetching user-specific appointments.

For example:

```http
Authorization: Bearer <jwt-token>
```
