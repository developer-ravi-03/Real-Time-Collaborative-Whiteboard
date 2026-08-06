import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected");

  // socket.emit(
  //   "room:join",
  //   {
  //     roomId: "cmsae1qf80000oo9mi2eiipf7",
  //   },
  //   (response) => {
  //     console.log("JOIN RESPONSE");
  //     console.log(response);

  //     socket.emit("room:leave", console.log);

  //     socket.emit("presence:get", (users) => {
  //       console.log("ONLINE USERS");
  //       console.log(users);
  //     });

  //     socket.emit(
  //       "page:change",
  //       {
  //         pageId: "cmsg4jfhj0002eo9mnocani91",
  //       },
  //       console.log,
  //     );

  //     socket.emit(
  //       "board:change",
  //       {
  //         boardId: "cmsg3ev4v0006nk9m8xbb2m72",
  //       },
  //       console.log,
  //     );
  //     socket.emit(
  //       "session:close",
  //       {
  //         roomId: "cmsae1qf80000oo9mi2eiipf7",
  //       },
  //       console.log,
  //     );
  //   },
  // );

  socket.emit(
    "room:join",
    {
      roomId: "cmsae1qf80000oo9mi2eiipf7",
    },
    () => {
      // socket.emit(
      //   "session:close",
      //   {
      //     roomId: "cmsae1qf80000oo9mi2eiipf7",
      //   },
      //   console.log,
      // );

      // socket.emit(
      //   "session:reopen",
      //   {
      //     roomId: "cmsae1qf80000oo9mi2eiipf7",
      //   },
      //   console.log,
      // );

      socket.emit("room:leave", console.log);
    },
  );

  // socket.emit("room:leave", console.log);
});

// socket.on("presence:update", (users) => {
//   console.log("PRESENCE UPDATE");
//   console.log(users);
// });

// socket.on("canvas:init", (data) => {
//   console.log("CANVAS INIT");
//   console.log(JSON.stringify(data, null, 2));

//   const pageId = data.page.id;

//   const canvasData = {
//     version: "6.0.0",

//     objects: [
//       {
//         type: "rect",
//         left: 100,
//         top: 100,
//         width: 150,
//         height: 100,
//         fill: "red",
//       },
//     ],
//   };

//   socket.emit("canvas:update", {
//     pageId,
//     canvasData,
//   });

//   socket.emit(
//     "canvas:save",
//     {
//       pageId,
//       canvasData,
//     },
//     console.log,
//   );
// });

socket.on("session:closed", (data) => {
  console.log("SESSION CLOSED");
  console.log(data);
});

socket.on("session:reopened", (data) => {
  console.log("SESSION REOPENED");
  console.log(data);
});
