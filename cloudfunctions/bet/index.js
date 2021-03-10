// 云函数入口文件
const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const moment = require("moment");
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  //event.data _id:xxx bet big(small) xxx
  console.log("event=======", event);
  const wxContext = cloud.getWXContext();
  let res = await db.collection('config').doc('configInfo').get();
  let date = new Date();
  let strNow = moment(date).format("YYYY-MM-DD HH:mm:ss SSS");
  if (res.data.isDoneJieSuan) {
    //可以入库
    let numCurQi = res.data.numCurQi;
    let strCurQi = numCurQi + '';
    let strDate = strCurQi.substr(0, 8);

    // let betData = await db.collection(`bet_${strDate}`).doc(numCurQi).get();
    let betObj = {
      big: 2,
      small: 10,
      openid: wxContext.OPENID,
      strNow
    }
    try {
      let betData = await db.collection(`bet_${strDate}`).doc(numCurQi).get();
      console.error('betData========', betData);
      if (betData.data.length === 0) {
        //用add
        return await db.collection(`bet_${strDate}`).add({
          data: {
            _id: numCurQi,
            bets: _.push(betObj)
          }
        });
      } else {
        //用 update
        return await db.collection(`bet_${strDate}`).doc(numCurQi).update({
          // data 传入需要局部更新的数据
          data: {
            bets: _.push(betObj)
          }
        })
      }
    } catch (error) {
      //用add
      return await db.collection(`bet_${strDate}`).add({
        data: {
          _id: numCurQi,
          bets: _.push(betObj)
        }
      });
    }

  } else {
    res["openid"] = wxContext.OPENID;
    res["now"] = strNow;
    res["error"] = {
      errCode: 10000,
      errDes: '结算中，请稍后...'
    }
    return res;
  }





}
