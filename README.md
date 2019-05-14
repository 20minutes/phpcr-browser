# PHPCR Browser [![Build Status](https://travis-ci.org/marmelab/phpcr-browser.svg?branch=master)](https://travis-ci.org/marmelab/phpcr-browser)

PHPCR Browser provides an intuitive web interface to explore and manage [PHPCR](http://phpcr.github.io/) repositories.
The current implementation supports [Jackalope Jackrabbit](https://github.com/jackalope/jackalope-jackrabbit) and [Jackalope Doctrine DBAL](https://github.com/jackalope/jackalope-doctrine-dbal).

![screenshot](http://marmelab.com/phpcr-browser/img/screenshot-1.2.png)

Supported Operations
---------------

**Jackalope Jackrabbit:**

 - **Workspace:** create
 - **Node:** create, delete, move
 - **Property:** create, delete, update

**Jackalope Doctrine DBAL:**

 - **Workspace:** create, delete
 - **Node:** create, delete, move
 - **Property:** create, delete, update

*See [marmelab/phpcr-api/config/factories.yml](https://github.com/marmelab/phpcr-api/blob/master/config/factories.yml) for more details.*

Installation
------------

PHPCR Browser uses [Composer](https://getcomposer.org/) and [Bower](http://bower.io/) to manage its dependencies. Make sure they are **globally installed** before continuing.

#### 1. Clone the repository
```sh
git clone git@github.com:20minutes/phpcr-browser.git
cd phpcr-browser
```

#### 2. Install dependencies and configure the browser
To install the web application with the default configuration (see below), run the following command:

```sh
composer install
```

Ensure you use the correct node version (using [nvm](https://github.com/nvm-sh/nvm)):

```sh
nvm install 0.10
```

Then:

```sh
bower install
```

If a `bower EINVRES` error appears, try:

```sh
npm i -g bower
```

Then try again:

```sh
bower install
```

---
Configuration
-------------
Create a `config/prod.yml` with the connection settings for the repositories you need to browse:

```yml
phpcr_repositories:
    'Local Repository':
        factory: jackalope.jackrabbit
        parameters:
            jackalope.jackrabbit_uri: 'http://localhost:8080/server'
            credentials.username: admin
            credentials.password: admin

    'Prod Repository':
        factory: jackalope.jackrabbit
        parameters:
            jackalope.jackrabbit_uri: 'http://localhost:8088/jackrabbit/server'
            credentials.username: admin
            credentials.password: admin
```

Usage
-----

#### SSH Tunnel

Open an SSH tunnel to JCR:

```
ssh -L 8088:jackrabbit.20mn.net:8080 deploy@deploy-01
```

#### Using Apache VirtualHost

Add a VirtualHost to your Apache config (and add in it 'AllowEncodedSlashes On'):

```
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /home/<you>/phpcr-browser/web
    ServerName phpcr-browser
    AllowEncodedSlashes On

    <Directory /home/<you>/phpcr-browser/web>
        DirectoryIndex index.html index.php
        Options FollowSymLinks
        AllowOverride All
        Require All Granted
    </Directory>
</VirtualHost>
```
And update your `/etc/hosts` file by adding:

```
127.0.0.1   phpcr-browser
```

You can now access the repository by browsing to http://phpcr-browser/browser/#/.

Tests
-----

The PHPCR Browser AngularJS part is fully unit tested with [Karma](http://karma-runner.github.io/) and [Jasmine](http://jasmine.github.io/).
If you want to run them, install dependencies by running: `make install-test`

Then run the following command: `make test-spec`

Sass
----

The stylesheets are compiled by [Compass](http://compass-style.org/) and [Sass](http://sass-lang.com/).

If you update the sass files, run `make compass-watch` during development.

When your work is done, run `make compass-compile` before committing.

Contributing
---------

All contributions are welcome and must pass the tests. If you add a new feature, write tests for it.

License
-------

This application is available under the MIT License, courtesy of [marmelab](http://marmelab.com).
