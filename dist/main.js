"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./app/service");
service_1.app.listen(process.env.SERVICE_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVICE_PORT}`);
});
