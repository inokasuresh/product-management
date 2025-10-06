require('dotenv').config();
const server = require('./server');

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});
