const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "src/utils/token.json";
const CREDENTIALS_PATH = "src/utils/credentials.json";
// Load client secrets from a local file.
const loadLastestState = (response) => {
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), downloadFile, response);
  });
};

const saveLastestState = async (request, response) => {
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Drive API.
    return authorize(JSON.parse(content), uploadFile, request, response);
  });

  //throw new Error("Error loading client secret file:", error);
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, request, response) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  return fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback, request, response);
    oAuth2Client.setCredentials(JSON.parse(token));
    return callback(oAuth2Client, request, response);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback, request, response) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client, request, response);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

const uploadFile = async (auth, request, response) => {
  try {
    const drive = await google.drive({ version: "v3", auth });
    const file = await drive.files.create({
      resource: {
        name: "save_" + new Date().getTime() + ".json",
        mimeType: "application/json",
      },
      media: {
        mimeType: "application/json",
        body: JSON.stringify(request.body),
      },
      fields: "id",
    });
    response.send({ status: "success", statusCode: 201, data: file.data });
  } catch (error) {
    throw response.send({
      status: "error",
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

const downloadFile = async (auth, response) => {
  try {
    const drive = await google.drive({ version: "v3", auth });
    const files = await drive.files.list();
    const lastestId = files.data.files[0].id;
    const lastestData = await drive.files.get({
      fileId: lastestId,
      alt: "media",
    });
    response.send({
      status: "success",
      statusCode: 200,
      data: lastestData.data,
    });
  } catch (error) {
    throw response.send({
      status: "error",
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

module.exports = { saveLastestState, loadLastestState };
