const dotenv = require("dotenv");

const app = require("./src/app.js");
const connectDB = require("./src/config/db.js");

dotenv.config();
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
