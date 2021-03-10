// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const moment = require("moment");
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {
  if (process.env.SWITCH === 'OFF') {
    return;
  }

  moment.locale("zh-cn");
  let a = Math.round(Math.random() * 5) + 1;
  let b = Math.round(Math.random() * 5) + 1;

  let date = new Date();
  //触发时间
  let timestamp = date.getTime();
  let dateFmt = moment(date).format("YYYY-MM-DD HH:mm:ss SSS");

  let sec = date.getSeconds();
  //修正时间，因为正常时59s的时候会触发，但是实际测试有到下一分钟才触发，
  if (sec != 59) {
    timestamp = timestamp - (sec + 1) * 1000;
    date = new Date(timestamp);
  }
  let qi = (date.getHours() * 60 + date.getMinutes() + 1).toString().padStart(4, "0");
  let dateFmtQi = Number((moment(date).format("YYYYMMDD") + qi));
  let result = a + b;
  let resultDes = result > 6 ? '大' : '小';

  //console.log(`dateFmt = ${dateFmt}, a = ${a}, b = ${b}, resultDesc = ${resultDesc} dateFmtQi = ${dateFmtQi}`);

  //一、将结果存到数据库中
  try {
    db.collection(`dataResult_${moment(date).format("YYYYMMDD")}`).add({
      data: {
        _id: dateFmtQi,
        time: dateFmt,
        qi: dateFmtQi,
        val1: a,
        val2: b,
        result,
        resultDes
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        //console.log("res: ", res);
      }
    });
  } catch (error) {
    console.error(error);
  }


  //更新状态
  try {
    let dateFmtQiNext = 0;
    if (Number(qi) + 1 === 1440) {
      //+10s到下一分钟，计算下一期的数值
      let timestampNext = timestamp + 10 * 1000;
      let dateNext = new Date(timestampNext);
      let qiNext = (dateNext.getHours() * 60 + dateNext.getMinutes() + 1).toString().padStart(4, "0");
      dateFmtQiNext = Number((moment(dateNext).format("YYYYMMDD") + qiNext));
    } else {
      dateFmtQiNext = dateFmtQi + 1;
    }

    //先锁定库，阻止bet结果入库时的下注消息，等处理完了才能下注
    db.collection('config').doc('configInfo').update({
      data: {
        isDoneJieSuan: false,
        numCurQi: dateFmtQiNext
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        //console.log("res: ", res);

        //处理bet结果入库
        db.collection('bet').doc('').update({
          data: {
            isDoneJieSuan: false,
            numCurQi: dateFmtQiNext
          },
          success: function (res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            //console.log("res: ", res);
    
            //处理bet结果入库
    
    
          }
        });

      }
    });


    //处理bet结果入库


    //解锁库，置状态为可下注


  } catch (error) {
    console.error(error);
  }

  


}

