# Formality

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It contains the entire web console code currently available for interacting with the Kvinta Cloud.

- [Kvinta Portal POC](#kvinta-portal-poc)
  - [Installation](#installation)
  - [Project notations](#project-notations)
    - [Modules](#modules)
      - [Stores](#stores)
      - [View](#view)
      - [Dialogs](#dialogs)
      - [Paths](#paths)
  - [Available Scripts](#available-scripts)
    - [Project specific](#project-specific)
    - [`npm start`](#npm-start)
    - [`npm test`](#npm-test)
    - [`npm run build`](#npm-run-build)
    - [`npm run eject`](#npm-run-eject)
  - [Learn More](#learn-more)
    - [Code Splitting](#code-splitting)
    - [Analyzing the Bundle Size](#analyzing-the-bundle-size)
    - [Making a Progressive Web App](#making-a-progressive-web-app)
    - [Advanced Configuration](#advanced-configuration)
    - [Deployment](#deployment)
    - [`npm run build` fails to minify](#npm-run-build-fails-to-minify)
## Installation

```bash
npm install
```

Once installed, you need to run `./contrib/set_env_vars.sh .env ./public/` to set the necessary environment variables.

## Project notations

### Modules

A **module** is composition of one or meny Views/Dialogs/Modules and their stores

#### Stores

MobX stores are placed in the module folder and are named ***MyName***`Store`

#### View

View are React components that are rendered in the main route/menu. They are placed in `views` under the module folder They should be named ***MyName***`View`

OR

They are named `View`***MyName*** and are placed in the module folder

#### Dialogs

Dialogs are React components that are rendered in views. They are placed in `views` folder under the module folder They should be named ***MyName***`Dialog`

OR

They are named `Dialog`***MyName*** and are placed in the module folder

#### Paths

`paths.ts` contain the underlying path definitions used in main router and functions for cross history navigations.

## Available Scripts

In the project directory, you can run:

### Project specific

* `yarn start-win` - to start the dev server under Windows, without setting env varaibles (have to be set manually).
* `yarn generate-apis` - to generate the OpenAPI code.
* `yarn analyze` - analyze with source-map-explorer.
* `yarn lint` - to lint the source code.


### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
