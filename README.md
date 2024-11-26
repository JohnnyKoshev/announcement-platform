# Announcement Platform

The **Announcement Platform** is a robust, modular web application designed to facilitate user interactions, announcements, and chats. It is built using **NestJS** as the backend framework and employs clean architectural principles to maintain scalability, maintainability, and security.

---

## Table of Contents

1. [Features](#features)
2. [Directory Structure](#directory-structure)
    - [Core Modules](#core-modules)
    - [Feature Modules](#feature-modules)
3. [Data Models and DTOs](#data-models-and-dtos)
4. [Installation](#installation)
5. [Usage](#usage)
    - [API Endpoints](#api-endpoints)
    - [WebSocket Events](#websocket-events)
6. [Contributing](#contributing)
7. [License](#license)

---

## Features

- **User Management**: CRUD operations for user accounts and roles.
- **Authentication & Authorization**: Secure login and role-based access control using JWT and local strategies.
- **Chat Functionality**: Real-time communication with message storage and retrieval.
- **Announcement Management**: Support for both individual and juridic announcements.
- **Attachment Handling**: Upload and manage attachments for announcements and messages.
- **Admin Dashboard**: Tools for administrators to manage users, categories, and system configurations.

---

## Directory Structure

The project is divided into several modules to ensure modularity and separation of concerns:

### **Core Modules**
- `app.module.ts`: Main application module orchestrating the system.
- `database.module.ts` & `database.service.ts`: Configures and manages database connections using Prisma.

### **Feature Modules**
#### **User Management**
- `user.controller.ts`
- `user.module.ts`
- `user.service.ts`

#### **Authentication**
- `auth.controller.ts`
- `auth.module.ts`
- `auth.service.ts`
- `jwt.strategy.ts`
- `local.strategy.ts`
- `local-auth.guard.ts`
- `role.guard.ts`
- `roles.decorator.ts`

#### **Announcement Management**
- **Juridic**:
  - `juridic.controller.ts`
  - `juridic.module.ts`
  - `juridic.service.ts`
- **Individual**:
  - `individual.controller.ts`
  - `individual.module.ts`
  - `individual.service.ts`

#### **Chat System**
- `chat.gateway.ts`: Real-time communication handling using WebSockets.
- `chat.module.ts`
- DTOs:
  - `create-chat.dto.ts`
  - `create-message.dto.ts`
  - `find-chat.dto.ts`
  - `get-chat.dto.ts`
  - `get-msgs.dto.ts`

#### **Admin Tools**
- `admin.controller.ts`
- `admin.module.ts`
- `admin.service.ts`

---

## Data Models and DTOs

The **Prisma Schema** (`schema.prisma`) defines the data models and relationships. DTOs (Data Transfer Objects) are used for encapsulating data sent and received:

- `create-ad.dto.ts` & `update-ad.dto.ts`: Manage announcements.
- `create-offer.dto.ts` & `update-offer.dto.ts`: Manage offers.
- `category.dto.ts`: Define and manage categories.
- `update-attachment.dto.ts` & `upload-attachment.dto.ts`: Handle file attachments.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JohnnyKoshev/announcement-platform.git
   cd announcement-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file based on the example provided and configure the database connection and other settings.

4. Run the application:
   ```bash
   npm run start
   ```

5. For development with hot-reloading:
   ```bash
   npm run start:dev
   ```

---

## Usage

### API Endpoints
- **Authentication**:
  - `/auth/login`: User login.
  - `/auth/register`: User registration.
- **Users**:
  - `/user`: Manage user profiles and roles.
- **Announcements**:
  - `/juridic`: Manage juridic announcements.
  - `/individual`: Manage individual announcements.
- **Chat**:
  - `/chat`: Initiate and manage chats.

### WebSocket Events
- `message`: Send and receive real-time chat messages.

---

## Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request if you would like to contribute.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
