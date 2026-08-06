import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected");

  socket.emit(
    "room:join",
    {
      roomId: "cmsg2r5ob00005k9mmiqe5679",
    },
    (response) => {
      console.log("JOIN RESPONSE");
      console.log(response);

      socket.emit("presence:get", (users) => {
        console.log("ONLINE USERS");
        console.log(users);
      });
    },
  );
});

socket.on("presence:update", (users) => {
  console.log("PRESENCE UPDATE");
  console.log(users);
});
