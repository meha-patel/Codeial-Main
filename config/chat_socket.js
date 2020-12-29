module.exports.chatSockets = (socketServer) => {
    let io = require('socket.io')(socketServer, {
        cors: {
            origin: '*',
        }
    });

    io.sockets.on('connection', function(socket) {
        console.log("New connection Received", socket.id);


        socket.on('disconnect', function() {
            console.log("socket disconnected");
        });

        socket.on('join_room', function(data) {
            console.log("Joining Request received", data);
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined', data);
        });

        socket.on('send_message', function(data) {
            io.in(data.chatroom).emit('receive_message', data);
        });
    });
}

// module.exports.chatSockets = (socketServer) => {
//     let io = require('socket.io')(socketServer, {
//         cors: {
//             origin: "*",
//         }
//     });

//     io.sockets.on('connection', function(socket) {
//         console.log("New connection received", socket.id);
//         socket.on('disconnect', function() {
//             console.log('socket disconnected');
//         });
//         socket.on('join_room', function(data) {
//             console.log('joining request received', data);
//             socket.join(data.chatroom);
//             io.in(data.chatroom).emit('user_joined', data);
//         });
//         socket.on('send_message', function(data) {
//             io.in(data.chatroom).emit('receive_message', data);
//         });
//     });
// }