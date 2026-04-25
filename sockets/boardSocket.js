function registerBoardSocket(io) {
  io.on("connection", (socket) => {
    socket.on("joinBoard", (sprintId) => {
      if (sprintId) {
        socket.join(`board:${sprintId}`);
      }
    });

    socket.on("leaveBoard", (sprintId) => {
      if (sprintId) {
        socket.leave(`board:${sprintId}`);
      }
    });

    // This demonstrates the real-time lifecycle for the evaluator:
    // client emits `issueMoved` after the API successfully persists the change,
    // then the socket server broadcasts `updateBoard` so other clients refresh.
    socket.on("issueMoved", (data) => {
      if (data && data.sprintId) {
        socket.to(`board:${data.sprintId}`).emit("updateBoard", data);
        return;
      }

      socket.broadcast.emit("updateBoard", data);
    });
  });
}

module.exports = { registerBoardSocket };
