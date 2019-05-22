const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')

exports.main = async (event, context) => {
  const fileStream = fs.createReadStream(path.join(__dirname, event.path))
  return await cloud.uploadFile({
    cloudPath: 'demo.jpg',
    fileContent: fileStream,
  })
}