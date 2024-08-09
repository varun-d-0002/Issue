# System

1. [Setup](#setup)
1. [Useful commands](#useful-commands)
1. [DB migration](#db-migration)
1. [Run](#Run)
1. [Setting up Line accounts](#Setting-up-Line-accounts-and-client-side-liff-application)

---

### Setup

1. Create set environment variables with .env file
2. Prepare db for testing - lookup backend-src/backend/tests/setEnvVars.ts

---

### Useful commands

```sh
npm run build
npm run lint
npm run pretty
npm run test

```

##### FS init

File systems - initialize directories for uploads & logs.

```sh
npm run fs:init
```

##### DB migration

DB structure

```sh
npm run db:init -- init:sync
```

DB initialize manager
To set initial manager credentials, add values to the following environment variables:
INIT_MANAGER_EMAIL,INIT_MANAGER_USERNAME,INIT_MANAGER_PW
For example

```
INIT_MANAGER_EMAIL="noreply@testweb-demo.com"
INIT_MANAGER_USERNAME="example_admin"
INIT_MANAGER_PW="testtest1"
```

Then run

```sh
npm run db:init -- init:manager
```

DB initialize dummy member data

```sh
npm run db:init -- init:member
```

OR
Do everything in one go.
Note: order matters

```sh
npm run db:init -- init:quickSync,manager,member
```

---

### Test coverage

[test coverage](backend-src/backend/tests/coverage/lcov-report/index.html)

---

### Run

1. setup your environment variables
2. setup development environment in .env
3. npm run i
4. npm run dev

---

### Setting up Line accounts and client side liff application

1. Sign up with business account at https://account.line.biz/signup
2. Create Provider at https://developers.line.biz/console/ Please refer to https://developers.line.biz/en/docs/line-developers-console/overview/#provider
3. After your create provider, create Channel. Please refer to https://developers.line.biz/en/docs/line-developers-console/login-account/#available-features
   You need Line login and Messaging API
4. Setting up Web Hook: From Messaging API channel/ messaging API tab set the webhook settings.
    ```sh
    For example : yourWebsiteUrl/api/hooks/line
    ```
5. Creating channel access token: From Messaging API, issue the Channel access token(long lived). This access token should be set in your env file as LINE_CHANNEL_ACCESS_TOKEN= "**your access token**"
6. Setting up ENV file:

```sh
  LINE_CHANNEL_ACCESS_TOKEN="**your access token**" // this is located at Messaging API channel/messaging api tab

  LINE_CHANNEL_SECRET="**your channel secret**" // this is located at Messaging API channel/ basic settings tab

  LINE_LOGIN_CHANNEL_ID="**your channel ID **" // this is located at Line Login channel/basic settings tab

  LINE_LIFF_URI="**your LIFF URL**" // this is located at Line Login channel/LIFF tab
```

7. Setting up Line Login Channel~ Important Notice: In the Basic settings tab, Make sure your choose **Linked OA** as your chanel credential. Dont leave it empty.

In the LIFF tab you will set up your liff application credentials.
Your Endpoint URL should be in this format: "**Your website URL**/liff/login/**yourliffID**" copy and enter to the LIFF URL and you will be able to see your client side UI.

Happy Coding!🎉🎉🎉
