const cloudinary = require("../config/cloudinary");

const uploadFile =  (fileBuffer) => {
  return  new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream({ resource_type: "raw" }, (err, response) => {
        if (err) return reject(err.response);
        return resolve(response);
      })
      .end(fileBuffer);
  });
};

// const getImage = (url) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.v2.uploader
//       .upload_stream({ resource_type: "raw" }, (err, response) => {
//         if (err) reject(err.response);
//         resolve(response);
//       })
//       .end(fileBuffer);
//   });
// };



module.exports = {
  uploadFile
}
