Techonlogy :
Backend : slimphp
Frontend : ReactJs
Deploy Env : Docker 


Video Demo :  [https://www.youtube.com/watch?v=xkZpwaDKw94](url)


Demo :
<img width="1680" alt="image" src="https://github.com/vaibhav31s/commentSystem/assets/58821506/88923b06-9deb-485b-ba89-29619f24c044">

<img width="1139" alt="image" src="https://github.com/vaibhav31s/commentSystem/assets/58821506/2eb41d32-e7a6-4b9b-bd3b-398cf7ecd240">

## Configuration

Database credentials are read from environment variables, not from the code.

```sh
cp .env.example .env   # set MYSQL_ROOT_PASSWORD and DB_PASSWORD (never commit .env)
docker compose up
```

`docker compose` reads `.env` and passes `DB_HOST`, `DB_NAME`, `DB_USER` and
`DB_PASSWORD` to the PHP container (and the same credentials to MariaDB).
The backend throws a clear error if `DB_PASSWORD` is not set.
