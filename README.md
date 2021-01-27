# question-5-server-side

## Task 2 Server-side

This can be install depedencies packages by typing the following command .
```
npm install or yarn install 
```
This can be run by typing the following command .
```
npm run-script start or yarn start
```

## API Document

| End Point   | Method |      Parameters      | Description |  Return |
| ------------|-------|-----------------------|-------------|---------|
| /calculator/load | Get |    | Get lastest state of Calculator application from file in Google Drive | Data of Calculator |
| /calculator/save | Post | A: number, B: number, operator: string, result: string | Create transaction data when purchasing boardgames | Created transaction object |
