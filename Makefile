PATH := ${CURDIR}/node_modules/.bin:${CURDIR}/node_modules/karma/bin:${PATH}
autoconfig?=true

compass-compile:
	compass compile -e production --force sass/screen.scss

compass-watch:
	compass watch sass/screen.scss

test:
	karma start config/karma.conf.js

install:
	composer install --no-interaction
	npm install
	bower install --config.interactive=false
ifneq ($(autoconfig), false)
	cp config/prod.yml-dist config/prod.yml
endif
	cp web/assets/js/browser/config.js-dist web/assets/js/browser/config.js

install-gaudi:
	gaudi run composer install
	gaudi run npm install
	gaudi run bower install
ifneq ($(autoconfig), false)
	cp config/prod.yml-dist config/prod.yml
endif
	cp web/assets/js/browser/config.js-dist web/assets/js/browser/config.js
	gaudi

install-test:
	npm install

install-test-gaudi:
	gaudi npm install
