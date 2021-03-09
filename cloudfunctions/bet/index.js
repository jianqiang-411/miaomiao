// 云函数入口文件
const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  //event.data _id:xxx bet big(small) xxx
  console.log("event=======", event);
  // console.log(context)


  return new Promise((resolve, reject) => {
    // setTimeout(() => {
    //   resolve("abcdefg");
    // }, 1000);

    db.collection('config').doc('configInfo').get({
      success: function (res) {
        // res.data 包含该记录的数据
        resolve("123456");
      },
      fail: function (err) {
        reject("123456789");
      }
    });
  });

}
