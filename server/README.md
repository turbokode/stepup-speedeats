# [SpeedEats backend]

## Table of Contents

- [\[SpeedEats backend\]](#speedeats-backend)
	- [Table of Contents](#table-of-contents)
	- [About the project](#about-the-project)
		- [Technologies](#technologies)
	- [API endpoints](#api-endpoints)
	- [Running the app in your local environment 🚀](#running-the-app-in-your-local-environment-)
		- [Prerequisites 📋](#prerequisites-)
		- [Installation 🛠️](#installation-️)
	- [How to Contribute](#how-to-contribute)
		- [Report Problems or Suggestions](#report-problems-or-suggestions)
		- [Contribute Code](#contribute-code)

## About the project

This is the backend of SpeedEats.

### Technologies

- [Node.js](https://nodejs.org/)
- [Fastify](https://fastify.dev/)
- [Prisma](https://www.prisma.io/)
- [Redis](https://redis.io/docs/connect/clients/nodejs/)
- [Twilio](https://www.twilio.com/en-us)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

## API endpoints


## Running the app in your local environment 🚀

Follow these steps to quickly configure and run **SpeedEats** in your local development environment.

### Prerequisites 📋

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) (package managers)
- [Git](https://git-scm.com/) (to clone the repository)
- [Postgres](https://www.postgresql.org/) or [MySQL](https://www.mysql.com/) (For the Database)
- [Redis](https://redis.io/) (For storing data in memory)
- [Firebase Authentication](https://firebase.google.com/docs/) - configure a Firebase project with Firebase Authentication

### Installation 🛠️

1. Clone the stepup-speedeats repository to your local machine:

```bash
git clone https://github.com/turbokode/stepup-speedeats/
```

2. Navigate to the project directory:

```bash
cd stepup-speedeats
```

3. Install project dependencies:

```bash
npm install
```

4. Create a .env file based on .env.example and configure the variables according to your environment

5. Run the migrations

```bash
npx prism migrate dev
```

6. Run the seeds

```bash
npx prism db seed
```

7. Run the project

```bash
npm run dev
```

7. Open an API client and execute some app requests

## How to Contribute

Your contribution is welcome! Follow the steps below to collaborate with the development of this project.

### Report Problems or Suggestions

If you encounter any problems or have suggestions for improvement, please open an **issue** in this repository. Be sure to include detailed information about the problem and/or your suggestion.

### Contribute Code

If you want to directly contribute code, follow the steps below:

1. Fork this repository.
2. Create a new branch for your contribution: `git checkout -b your-feature`.
3. Make the desired changes.
4. Be sure to test your changes.
5. Commit your changes: `git commit -m "Add your-feature"`.
