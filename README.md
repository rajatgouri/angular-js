# LIMS Documentation

## Table of Contents

- [Component Description](#components)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Initial Setup](#first%20time%20install)
    - [Gate Service](#gate%20service)
    - [User & Data Service](#user%20and%20data%20service%20configuration)
    - [Database](#database%20configuration)
    - [UI](#ui%20configuration)
    - [Helper API](#python%20helper%20configuration)
- [Updating](#script%20to%20update%20codebase)
- [Running](#running%20the%20application%20server)

The LIMS is seperated into five components

## Components

Look at the readme files within each components to see more details.

### User Interface (UI)

This section is powered by AngularJS (1.7.4) and webpack.

The UI is meant to be compiled into static files and not ran by the webpack dev server during production.

The UI communicates with the backend through the gate service over ```<hostname>/api```

### Gate Service

This functions as like a proxy for the data and user service. It directs the APIs to it's corresponding service. It also sets up the user session and performs authentication.

### Data Service

The data service performs all of the create, retrive, update, and destroy (CRUD) functions for the LIMS. It contains all of the database models and api routes to perform the CRUD operations.

### User Service

The user service saves all the user attributes and sets up the roles and permissions.

### Helper API

This is written in Python and helps the LIMS with data parsing from Excel, sets up data format for the charting libraries, and does other data retrieval tasks that is easier to do in Python.

### Tools used for development

- Visual Studio Code (free and open source)
- WebStorm (paid)

## Installation

### Prerequisites

App Server: NodeJS, NGINX. Optional: NGINX with ModSecurity.

Database Server: MariaDB (or MySQL). MS SQL or PostgreSQL is supported with additional setup. I use HeidiSQL as the GUI for database management.

Authentication services supported: LDAP (Active Directoy) or Azure Active Directory (OIDC).

### First time install

Clone the GitHub repository to bring down the source code

```git clone git@git.systimmune.net:it/lims.git```

Run the initial setup script to set up for the first time and install the dependancies.

```init-lims.bat```

Running this script copies the production sample config files in all of the backend services. They are located in ```<service>/config/env/```. Please check the configuration files and update according to your environment.

#### Gate Configuration

For the gate, there are several things you need to update in the environment configuration. First, you will need to change the ```expressSessionSecret``` to something random. This ensures that the encryption key used to hash Sessions are unique to your LIMS instance. 

Next you will need to set the database information to match your setup. I recommend creating a dedicated user for the LIMS and only allowing the app server in the from host field in MySQL.

The helper API field is the URL to contact the Python helper API. If it is located on the same computer as the app server, then the URL is usually ```http://127.0.0.1:5000```. 

The LIMS is set up to authenticate with Active Directory (or LDAP). To configure with your environment, I recommend creating a service account for the LIMS in AD that does not have log on privileges and can be used to query the AD server to check if a login is valid. 

The domain name goes in the ```url``` field, ex: ```ldaps://<domain>```. The     ```bindDn``` and ```bindCredentials``` are for the user name and password, respectively. Make sure that the username includes the FQDN. The sslCert field is if you want to set up SSL encryption for authentication requests between the LIMS and the Domain Controller (ldaps in the url field). This is the path to the certificate that you get from the Certificate Authority (CA). Enabling SSL is highly recommended.

The searchBase is where you want the LDAP query to start. If you want to match with users in the entire domain, you would use ```dc=domain,dc=net```. If you want to only match users ine the Active Users OU for example, you would use ```OU=Active Users,dc=systimmune,dc=net```. The searchFilter is how you want to query the AD server from the user input. The example provided is what you would generally use. You can read more here. The searchAttributes field is what information you want to get into the LIMS from AD.

#### User and Data Service configuration

For these two services all you need to do is update the database host, name, and credentials.

#### Database Configuration

The database needs to be MySQL, other databases are supported by the LIMS but it requires additional setup. Running the User and Data service will create the tables automatically for you. Once that is done you will need to 'seed' the database with some initial data such as roles, dropdown options, and the protein summary view. Run the ```data_service/sql/db_seed.sql``` file to do this. It will also make user ```nathan.thorpe@systimmune.com``` an administrator. To change this just update the username in the Users table.

#### UI Configuration

Set up NGINX to use the ```ui/dist``` directory as the root and to proxy requests to ```/api``` to the gate node. More information is in the UI Readme. A sample NGINX configuration is located in the UI directory.

#### Python Helper Configuration

Set the database information in the enviroment variables. Please read more about the configuration in ```helper/README.md```.

### Script to update codebase

Run ```deploy.sh``` (on Linux) update code and install all dependancies. You can also manually run ```git pull``` and ```npm run build``` to update the code and compile the UI.

### Running the application server

PM2 is a process manager that runs the all of the application services in the background. Instead of running it with ```node app.js``` in "fork" mode, where it only uses one thread, PM2 creates the services in "cluster" mode, which creates a thread per CPU core so it can handle more user connections. It also manages the environment variables and restarts if a memory leak is found.

Install PM2 globally by adding the ```-g``` tag.

```npm install -g pm2```

Start with

```pm2 start pm2-all.json --env production```

### Reload

```pm2 restart pm2-all.json --env production```

If it is a development instance, you can leave out the ```--env``` switch or just run it through ```node app.js```.