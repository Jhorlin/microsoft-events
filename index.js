import axios from "axios";
import querystring from "querystring";
import fs from "fs";
import util from "util";
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
(async () => {
  try {
    const config = JSON.parse(await readFile("./config.json"));
    const response = await axios.post(
      config.authUrl,
      querystring.stringify({
        client_id: config.clientId,
        scope:
          "OnlineMeetings.ReadWrite Calendars.ReadWrite Mail.ReadWrite Mail.Send",
        client_secret: config.secret,
        grant_type: "password",
        username: config.user,
        password: config.pass,
      })
    );
    const accessToken = response.data.access_token;
    const events = await axios.get(`${config.graphUrl}/me/calendar/events?$top=100`,{
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    await writeFile('events.json', JSON.stringify(events.data.value, null, 4))
  } catch (e) {
    console.log(e);
  }
})();
