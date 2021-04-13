Dev Setup
-

* Install `MySQL` (or `MariaDB`) server
* Change root password and change accordingly in `config/env/development.json5`
* Create `mean_relational` schema using MySql workbench
* Read about [Angular](http://www.w3schools.com/angular/angular_intro.asp)
* Read about [Github markdown](https://guides.github.com/features/mastering-markdown/)
* Read about [Sequelize](http://docs.sequelizejs.com/en/latest/)
* Read about [UI router](https://github.com/angular-ui/ui-router/wiki)
* Read about [express](http://expressjs.com/)
* Read about [Grunt](http://gruntjs.com/)
* Read about [express session](https://github.com/expressjs/session)
* Read about [optional route params](http://benfoster.io/blog/ui-router-optional-parameters)

Dev Setup for Windows
-

* Install `nodejs` windows
* Install `git for windows` (Use `msys2` or `git bash` for command line)
* Use `git bash` instead of Windows cmd
* `npm install -g grunt` (`-g` flag means __global__, needs `sudo` permission)
* `npm install -g bower`
* `npm install -g pm2`
* `npm install`
* `bower install`
* To run a node, go to `ui/` or `data_service` or `user_service` or `gate` and run `node app.js` (port number is specific in config file, you can override with environment varialbe `PORT=4000` for example.)

## Microservices configuration (dev)

* `UI` service. `Ran by npm run start`
* `Data` service at port 3001
* `User` service at port 3002
* Gateway(`gate`) service at port 3003


## Some issues

* Key size too long during create table.  Because default charset  is utf8mb4 and 255 * 4 is greater than the limit.
  To solve this, change default charset from `utf8mb4` to `utf8`. Search and replace
  all such strings in `/etc/mysql/*`. Kill `mysqld` and restart. (`MariaDB` service also called `mysqld`, since it is designed to be _drop-in replacement_)
* MySQL performance tuning:
  ```
    innodb_io_capacity = 2000
    innodb_read_io_threads = 64
    innodb_thread_concurrency = 0
    innodb_write_io_threads = 64
    innodb_buffer_pool_size=1G
  ```
* Need to get time zone info for some sql scripts to work `mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root mysql -p`.
* `pm2 start pm2-all.json --env producition` can be used to start all nodes in one go
* Check pm2 logs at `~/.pm2/logs` or by running `pm2 logs`.
* `pm2 list` to check node services status (uptime, restart times etc.)
* `pm2 stop pm2-all.json --only data` can be used to stop only one node instance (similar for starting one)

## Deploy to Production Server

Do not commit private keys or any important passwords into git.

Database information:
```
IP: limsprd-db1.systimmune.net
user: lims_app
<password not shown>
Instance: SI_LIMS_PRD
```

# Import EnumConfigs, Roles, and Create admin user
```
mysql -u root -p <dbname> < data_service/sql/db_seed.sql
```
Change username to your email.


Coding style recommendation
-

* No tabs, all spaces. Use a text editor that converts to spaces
* 4 spaces indentation (some files use 2 spaces. Don't care too much)
* No white spaces on end of line
* Unix/Mac line ending
* Avoid reformatting whole files while doing patches (makes it harder to find the diff). You can do a dedicated patch if want to clean up the formatting a little more, just don't mix with real code changes in the same patch.

## Code breadcrumbs

* Main Angular file: `public/app/js/app.js`
* Common codes are near end of `app.js` in `SiHttpUtil`, `Global`, `SiUtil` etc.

Code reading
-

* Looks like this framework uses UI router instead of the core `ngRoute`. See
    [comparison between the
    two](http://www.amasik.com/angularjs-ngroute-vs-ui-router/)

Code debug
-

* Record POST/GET requests across page reload/redirect: Select "Preserve log" in
    Chrome developer tools' network tab. Or, can try Fiddler to capture system
    wide http traffic.
* When simulate a user login POST, put in the content-type in header.

Links
-

* The widgets are from a paid theme pack
  [Angle](https://wrapbootstrap.com/theme/angle-bootstrap-admin-template-WB04HF123)
