const http = require("http")
const express = require("express");
const app = express();
const cors = require("cors")
const socket = require("socket.io")
const server = http.createServer(app)
const io = socket(server,{
  cors:{
    origin:'http://localhost:3000',
    methods:["GET","POST"]
  }
})


app.use(cors())
app.use(express.json())

io.on('connection',(socket)=>{
  console.log('user is connected')

   socket.on('join_room',(data)=>{
   socket.join(data)
   console.log("User Joined Room: "+ data)
  })

   socket.on('send_message',(data)=>{
     socket.to(data.room).emit('receive_message',data.content)
   })

  socket.on('disconnect',()=>{
    console.log("User Disconnected")
  })
})

server.listen(5000, () => {
  console.log("server is running on 5000");
});