import mongoose from 'mongoose'

const workflowEventsSchema = mongoose.Schema({
    availableEvents: {
        type: {},
        default : {
            1: "On new lead",
            2: "On Lead conversion",
            3: "On Post Production",
            4: "On Wrapped Up",
            5: "On Workforce Added",
            6: "On Task Assigned"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
})

const WorkflowEvents = new mongoose.model("WorkFlowEvents",workflowEventsSchema);
export default WorkflowEvents