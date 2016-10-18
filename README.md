# Vending Admin

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.15.

For correct work all npm-packages need:

'sudo npm install typings -g'


## Certificate issue on testing server
In order to login to the app you will need to add certificate of sjcoins.testing.softjourn.if.ua to trusted store.

###Linux
Most browsers use their own CA database, and so tools like certutil have to be used to modify their contents (on Debian that is provided by the libnss3-tools package). For example, with Chrome you run something along the lines of:

`certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n "Softjourn CA" -i /path/to/CA/cert.file`
Firefox will allow you to browse to the certificate on disk, recognize it a certificate file and then allow you to import it to Root CA list.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). 
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
