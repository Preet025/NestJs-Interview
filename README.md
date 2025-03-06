# NestJs-Interview
Coding Exercise for NestJs Backend (User Management and Document Management)


Project Plan:

## Key Features

* Microservices Architecture:
    * Separation of concerns for improved scalability and maintainability.
    * Admin User Service and General User Service communicate effectively.
* Role-Based Access Control (RBAC):
    * Admin: Full control over users, roles, and documents.
    * Editor: Ability to upload, delete, and manage documents.
    * Viewer: Read-only access to documents.
* JWT Authentication:
    * Secure user authentication using JSON Web Tokens (JWT).
    * Register, login, and logout functionalities.
* Document Management:
    * Users with editor roles can upload and delete documents.
    * Utilizes Multer library for efficient file uploads.
* User Management (Admin Only):
    * Admin users can create, delete, and modify user roles.
    * Ability to promote users to admin roles.
* CRUD Operations:
    * Standard Create, Read, Update, and Delete operations for users and documents.
* Database:
    * PostgreSQL for reliable and scalable data storage.
* Microservice Communication:
    * RabbitMQ for asynchronous and reliable communication between microservices.

## Architecture

The project employs a microservices architecture to ensure scalability and maintainability.

* Admin User Service:
    * Handles user authentication, registration, login, logout, and admin-specific user management tasks.
    * Manages user roles and permissions.
* General User Service:
    * Manages document uploads, deletions, and access control.
    * Provides document retrieval functionalities based on user roles.
    * Handles editor and viewer role functionality.
* Communication:
    * RabbitMQ is used as the message broker for communication between the Admin User Service and the General User Service. This allows for asynchronous and reliable message delivery.
* Data Storage:
    * PostgreSQL database stores user information, document metadata, and other relevant data.

## Technologies Used

* NestJS: A progressive Node.js framework for building efficient and scalable server-side applications.
* TypeScript: For type safety and improved code maintainability.
* PostgreSQL: A powerful and open-source relational database.
* JWT (JSON Web Tokens): For secure authentication and authorization.
* Multer: Node.js middleware for handling multipart/form-data, primarily used for file uploads.
* RabbitMQ: Message broker for microservices communication.
* TypeORM: Object-Relational Mapping (ORM) for database interaction.
