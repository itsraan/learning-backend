import { app } from "./app/service"

app.listen(process.env.SERVICE_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVICE_PORT}`)
})