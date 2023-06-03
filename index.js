import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'

import errorHandler from "./middleware/error.js"

import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"
import projectRoutes from "./routes/projects.js"
import workforceRoutes from "./routes/workforce.js"
import taskRoutes from "./routes/tasks.js"
import designationRoutes from "./routes/designation.js"
import taxRoutes from "./routes/tax.js"
import packageRoutes from "./routes/package.js"
import referenceRoutes from "./routes/reference.js"
import userSettingRoutes from "./routes/userSettings.js"
import emailSettingsRoutes from "./routes/emailSettings.js"
import emailTemplateRoutes from "./routes/emailTemplate.js"
import settingsRoutes from "./routes/settingsRoutes.js"
import expenseRoutes from "./routes/expense.js"
import workflowRoutes from "./routes/automation.js"
import subscriptionRoutes from "./routes/subscription.js"
import analyticsRoutes from "./routes/analytics.js"
import assetsRoutes from "./routes/assets.js"
import eventRoutes from "./routes/workflowEvents.js"
import exportRoutes from "./routes/data.js"

const app = express()


// require("dotenv").config({path: './config.env'})

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))

app.use(cors())

//Routes
app.use('/posts',postRoutes);
app.use('/user',userRoutes);
app.use("/projects",projectRoutes);
app.use("/workforce",workforceRoutes);
app.use("/wf/tasks",taskRoutes);
app.use("/wf/designation",designationRoutes);
app.use("/revenue/expenses",expenseRoutes);
app.use("/revenue/tax",taxRoutes);
app.use("/project/package",packageRoutes);
app.use("/project/reference",referenceRoutes);
app.use("/settings/basic",userSettingRoutes);
app.use("/settings/mail",emailSettingsRoutes);
app.use("/settings/mail/template",emailTemplateRoutes);
app.use("/settings/automation/mail",settingsRoutes);
app.use("/workflow",workflowRoutes);
app.use("/subscription",subscriptionRoutes);
app.use("/dashboard",analyticsRoutes);
app.use("/assets",assetsRoutes);
app.use("/events",eventRoutes);
app.use("/download",exportRoutes);





app.use(errorHandler)

const CONNECTION_URL = 'mongodb+srv://classed:wNnb6cE8BbDtU3Me@cluster0.iumc0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// const CONNECTION_URL = process.env.MONGODB
const PORT = process.env.PORT || 5000

// mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
mongoose.connect(CONNECTION_URL)

.then(() => app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`)))
.catch((error) => console.log(error.message))

// mongoose.set('useFindAndModify',false);








