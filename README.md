# Models

## User

- id
- username
- pasword

## Project

- id
- name
- code
- ownerId: {type: ObjectId, ref: User}


# API

## POST /auth/login
## POST /auth/signup
## POST /auth/logout
## GET /auth/me

## GET /project
## GET /project/:id
## GET /project/search?owner=xxxx
## POST /project/
## PUT /project/:id
