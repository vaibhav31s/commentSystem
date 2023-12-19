// import React from "react";

// const data = [
//   {
//     mainReplyId: 1, // primary key
//     reply: "vaibhav here",
//     replyId: null,
//     authorName: "vaibhav gawad",
//     timestamp: "2023-12-18 00:00:00",
//     commentId: 4,
//   },
//   {
//     mainReplyId: 2, // primary key
//     reply: "vaibhav here",
//     replyId: 1,
//     authorName: "vaibhav gawad",
//     timestamp: "2023-12-18 00:00:00",
//     commentId: 4,
//   },
//   {
//     mainReplyId: 3, // primary key
//     reply: "vaibhav was here",
//     replyId: 2,
//     authorName: "vaibhav gawad",
//     timestamp: "2023-12-18 00:00:00",
//     commentId: 4,
//   },
//   {
//     mainReplyId: 4, // primary key
//     reply: "this is level 2 comment",
//     replyId: 1,
//     authorName: "vaibhav dumy",
//     timestamp: "2023-12-18 01:00:00",
//     commentId: 4,
//   },
//   {
//     mainReplyId: 5, // primary key
//     reply: "this is level 3 comment",
//     replyId: 3,
//     authorName: "Vaibhav Gawad",
//     timestamp: "2023-12-18 01:00:00",
//     commentId: 4,
//   },
// ];

// const data1 = [
//   {
//     mainReplyId: 1, // primary key
//     reply: "vaibhav here",
//     replyId: null,
//     authorName: "vaibhav gawad",
//     timestamp: "2023-12-18 00:00:00",
//     commentId: 4,
//     replies: [
//       {
//         mainReplyId: 2, // primary key
//         reply: "vaibhav here",
//         replyId: 1,
//         authorName: "vaibhav gawad",
//         timestamp: "2023-12-18 00:00:00",
//         commentId: 4,
//         replies: [
//           {
//             mainReplyId: 3, // primary key
//             reply: "vaibhav was here",
//             replyId: 2,
//             authorName: "vaibhav gawad",
//             timestamp: "2023-12-18 00:00:00",
//             commentId: 4,
//             replies: [
//               {
//                 mainReplyId: 5, // primary key
//                 reply: "this is level 3 comment",
//                 replyId: 3,
//                 authorName: "Vaibhav Gawad",
//                 timestamp: "2023-12-18 01:00:00",
//                 commentId: 4,
//                 replies: [],
//               },
//             ],
//           },
//         ],
//       },
//       {
//         mainReplyId: 4, // primary key
//         reply: "this is level 2 comment",
//         replyId: 1,
//         authorName: "vaibhav dumy",
//         timestamp: "2023-12-18 01:00:00",
//         commentId: 4,
//       },
//     ],
//   },
// ];

// const data2 = [
//   {
//     mainReplyId: 1,
//     reply: "vaibhav here",
//     replyId: null,
//     authorName: "vaibhav gawad",
//     timestamp: "2023-12-18 00:00:00",
//     commentId: 4,
//     replies: [
//       {
//         mainReplyId: 2,
//         reply: "vaibhav here",
//         replyId: 1,
//         authorName: "vaibhav gawad",
//         timestamp: "2023-12-18 00:00:00",
//         commentId: 4,
//         replies: [
//           {
//             mainReplyId: 3,
//             reply: "vaibhav was here",
//             replyId: 2,
//             authorName: "vaibhav gawad",
//             timestamp: "2023-12-18 00:00:00",
//             commentId: 4,
//             replies: [
//               {
//                 mainReplyId: 5,
//                 reply: "this is level 3 comment",
//                 replyId: 3,
//                 authorName: "Vaibhav Gawad",
//                 timestamp: "2023-12-18 01:00:00",
//                 commentId: 4,
//                 replies: [],
//               },
//             ],
//           },
//         ],
//       },
//       {
//         mainReplyId: 4,
//         reply: "this is level 2 comment",
//         replyId: 1,
//         authorName: "vaibhav dumy",
//         timestamp: "2023-12-18 01:00:00",
//         commentId: 4,
//         replies: [],
//       },
//     ],
//   },
// ];

// const map = new Map();
// for (let i = 0; i < data.length; i++) {
//   map.set(data[i].replyId, data[i]);
// }

// map.get(null).forEach((x) => {
//   map.get(x.mainReplyId).replies.push(x);
// });

// const Replies = () => {
//   return <div></div>;
// };

// export default Replies;
