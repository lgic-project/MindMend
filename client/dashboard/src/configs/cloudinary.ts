// import { rejects } from "assert"
// import { v2 as cloudinary } from "cloudinary";
// import { resolve } from "path"

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const upload =(file, folder) =>{
//   return new Promise((resolve, reject) =>{
//     cloudinary.uploader.upload(
//       file,
//       (result) =>{
//         resolve({
//           public_id: result.public_id,
//           url: result.url
//         })
//       },
//       {
//         resource_type: "auto",
//         folder: folder,
//       }
//     );
//   });
// }

// export default {cloudinary,upload};
