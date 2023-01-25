# Task Manager

## Overview

It's software to account for maintenance tasks.
We have two types of users that we can register to manage the tasks: Manager and Technician.

The Technician can perform, create, and update tasks that his own created.
The Manager can see all tasks, delete them if necessary, and receive a simple notification when some technician user performs the task.

This application has two primary responsibilities:

1. Manage users and authorization process using RBAC (Role-based access control) strategy.
2. Create, Read, Update, and Delete tasks, and register tasks performed during the working day.

## Technologies

- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://prisma.io/)
- [Docker](https://www.docker.com/)
- [MySQL](https://www.mysql.com/)
- [Kafka](https://kafka.apache.org/)

## Prerequisites

- [Node.js (LTS)](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Routes

- GET: / - Health check
- GET: /api - Swagger docs
- GET: /task - Get all tasks. If you are Manager, you can see all tasks. If Technician, you can see just task that this Technician create.
- POST: /task - Create a Task. Just Technician can use this route.
- DELETE: /task/:id - Delete task. Just Manager can use this route.
- PATCH: /task/:id - Perform task. Just Technician can use this route.
- POST: /auth/login - Login an user.

## Run project in the Development environment

Before all, you must create a .env file based on the .env.example.
After it, just run the command below. It will up all dependencies using docker-compose and start the project in watch mode of the NestJs project.

```sh
npm run start:dev
```

To run the project without watch mode, just run:

```sh
npm run start
```

In both commands, we already run the command to seed two types of users, one Manager, and one Technician, with the following credentials:

```json
 {
  "email": "technician@miguel.com",
  "password": "sword-pass"
 }
 {
  "email": "manager@miguel.com",
  "password": "sword-pass"
 }
```

If you want to change it, see the file `users/seed-users.ts.`

Remember that all project dependencies need to be installed in your environment.

## Test

In the test environment, you have the commands below to run the test suite:

```sh
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

All dependencies of the project are mocked in the test environment.
