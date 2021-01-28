# question-5-server-side

## Task 2 Server-side

This can be install depedencies packages by typing the following command .
```
npm install or yarn install 
```
This can be run by typing the following command . (It must be use port 3000 to run .)
```
npm run-script start or yarn start
```

## API Document
Base url: http://localhost:3000

| End Point   | Method |      Parameters      | Description |
| ------------|-------|-----------------------|-------------|
| /calculator/load | GET |    | Get lastest state of Calculator application from file in Google Drive |
| /calculator/save | POST | A: number, B: number, operator: string, result: string | Upload json file with lastest state of Calculator application to Google Drive |

* operator string should be in ["plus", "minus", "multiply", "divide", "power"]


## Google Drive APIs

Drive APIs must be use by Oauth2 to access APIs

When I use Oauth2 for the first time, I need to login for get the code of authorization and use it to get access token and refresh token.

I have attached token.json in this repository for Re-authentication with refresh token.

But if it can't connect use it to access APIs, I have attached config.js for username and password for GCP account of this project.
