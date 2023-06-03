import io from 'socket.io'

const i = io(3001,{
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET','POST'],
    },
})

i.on("connection",socket => {
    console.log("socket connected")
})