Proxies requests to the user and data services
Configuration for user & data endpoints are located in the config files

## Dev Setup

#### Config
```
cp config/env/development.json5.sample config/env/development.json
```
replace azure ad credentials and database credentials

```bash
install
node app.js
```


## Production Setup
```
cp config/env/production.json5.sample config/env/production.json
```
replace azure ad credentials and database credentials
replace helper API
replace express session secret with something random
```
npm install
```
use pm2 to start

create reverse proxy for <domain>/api to localhost:3003