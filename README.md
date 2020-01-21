This is a forum app made with Django Rest Framework and Next.js

---

## Run in development

### Server

- cd into `server/`
- Copy `.env.example` to `.env` and fill out.
- Run `pipenv install -d`
- Run `python manage.py migrate`
- Run `python manage.py runserver` to start django development server.

### Client

- Open a new terminal tab/window.
- cd into `client/`
- Run `yarn install`
- Run `yarn dev` to start the Next.js dev server.

The site can be accessed at http://localhost:3000/

If you create a superuser through manage.py you will need to create an auth token for them manually on the admin page or they will not be able to log in.

---

## Deploy commands for Dokku/Heroku:

So I don't forget them.

Client:
`git subtree push --prefix client dokku-client master`

Server:
`git subtree push --prefix server dokku-server master`
