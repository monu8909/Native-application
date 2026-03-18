/**
 * Socket.IO channels:
 * - "booking:<bookingId>": real-time updates for a booking (customer/admin/worker can join)
 * - "worker:<workerId>": worker-only channel for assignments
 */
export function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    socket.on("join", ({ room }) => {
      if (typeof room === "string" && room.length < 200) socket.join(room);
    });
    socket.on("leave", ({ room }) => {
      if (typeof room === "string" && room.length < 200) socket.leave(room);
    });
  });
}

export function emitBookingUpdate(app, booking) {
  const io = app.get("io");
  if (!io) return;
  io.to(`booking:${booking._id}`).emit("booking:update", booking);
}

