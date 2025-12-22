const app = require("./src/app");
const connectDB = require("./src/config/db");
require("./src/config/cron");

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`[Server] Running on port ${process.env.PORT}`);
    });
});
