# Calculator App
This app is an implementation of the Shunting-yard algorithm and Evaluation of Reverse Polish Notation that allows the user to type in a math problem as a string and recieve the answer. The app can be viewed at http://ts-calculater-app.s3-website.us-east-2.amazonaws.com.

This calculator supports positive, negative, and decimal numbers as operands. The calculator support addition (+), subtraction (-), multiplication (\*), division (/), exponents (^), parentheses (), logarithm base 10 (log()), natural logarithm (ln()), sine (sin()), cosine (cos()), tangent (tan()), and square root (sqrt()).

This app is build in typescript/React, packaged with webpack, and tested using Jest. The "prod" branch in this repo is monitored by AWS CodePipeline for changes, when a new commit is pushed to this branch it automates a test and deployment process using AWS CodeBuild and the "buildspec.yml" file as an instruction set. The test command "npm run test" is run prior to build and if it fails the process is aborted. If the test passes the build command "npm run build" compiles the typescript into javascript and bundles it in "build/main.js" with a "build/index.html" file that references the built javascript file. The contents of the build folder is then copied to an AWS S3 Bucket configured to serve a static website from the "index.html".

## Installation
### Prerequisites
- nodejs installed on your machine, this was built using v14.17.3
- npm installed on your maching, this was built using v7.20.5
### Steps
1. clone this repo to your local machine
2. run "npm install" in root directory
3. run "npm start" in root directory, this will start a development server where you can view the app at http://localhost:4000/

## Project Structure

Source files are located in the [src/](src/) directory, the Calculator module and its tests are located in the [src/utils](src/utils/)". Custom components for rendering the webpage are in [src/components](src/components/), and the app entry point is [src/index.tsx](src/index.tsx)
