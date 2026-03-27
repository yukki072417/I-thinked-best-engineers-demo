import "dotenv/config";
import { app } from "./app.js";

const port = Number(process.env.PORT ?? 4568);

app.listen(port, () => {
  console.log(`Demo backend running on http://localhost:${port}`);
});
