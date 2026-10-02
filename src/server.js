import { createApp } from "./api/createApp.js";

const port = Number(process.env.PORT) || 3000;
createApp().listen(port, () => {
  console.log(`Rannamõisa API töötab: http://localhost:${port}`);
});
