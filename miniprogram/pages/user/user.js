// miniprogram/pages/user/user.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: "../../images/user/user-unlogin.png",
    nickName: "小喵喵",
    logged: false,
    disabled: true,
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getUserLocation();

    wx.cloud.callFunction({
      name: 'login',
      data: {},
    }).then((res) => {
      db.collection('users').where({
        _openid: res.result.openid
      }).get().then((res) => {
        if (res.data.length) {
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          // this.getMessageList();
          this.getDataResult();
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            logged: true,
            id: app.userInfo._id
          });
        } else {
          this.setData({
            disabled: false
          });
        }

      });

    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userPhoto: app.userInfo.userPhoto,
      nickName: app.userInfo.nickName,
      id: app.userInfo._id
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindGetUserInfo(e) {

    let userInfo = e.detail.userInfo;

    if (!this.data.logged && userInfo) {
      db.collection("users").add({
        data: {
          userPhoto: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          signature: "",
          phoneNumber: "",
          winxinNumber: "",
          links: 0,
          time: new Date(),
          isLocation: true,
          friendList: [],
          longitude: this.longitude,
          latitude: this.latitude,
          location: db.Geo.Point(this.longitude, this.latitude)
        }
      }).then((res) => {
        db.collection('users').doc(res._id).get().then((res) => {
          app.userInfo = Object.assign(app.userInfo, res.data);
          console.log(app.userInfo);

          // this.getMessageList();
          this.getDataResult();

          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            logged: true,
            id: app.userInfo._id
          });

        });

      });
    }
  },
  getMessageList() {
    db.collection('message')
      .where({
        userId: app.userInfo._id
      })
      .watch({
        onChange: function (snapshot) {
          console.log('docs\'s changed events', snapshot)
          if (snapshot.docChanges.length) {
            let list = snapshot.docChanges[0].doc.list;
            if (list.length) {
              wx.showTabBarRedDot({
                index: 2,
              })
              app.userMessage = list;
            } else {
              wx.hideTabBarRedDot({
                index: 2,
              })
              app.userMessage = [];
            }
          }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
  },
  getDataResult() {
    // db.collection('dataResult_20210307')
    //   .where({
    //     _id: _.gt(202103070000)
    //   })
    //   .orderBy('_id', 'desc')
    //   .limit(3)
    //   .get()
    //   .then((res) => {
    //     console.log("a===bb==aaa====", res)
    

    //   });

    
      db.collection('dataResult_20210307')
        .where({
          _id: _.gt(202103070000)
        })
        .orderBy('_id', 'desc')
        .limit(1)
        .watch({
          onChange: function (snapshot) {
            console.log('docs\'s changed events', snapshot);
            // if (snapshot.docChanges.length) {
            //   let list = snapshot.docChanges[0].doc.list;
            //   if (list.length) {
    
            //   } else {
                
            //   }
            // }
          },
          onError: function (err) {
            console.error('the watch closed because of error', err)
          }
        })
        
  },
  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.latitude = res.latitude
        this.longitude = res.longitude
      }
    })

  }
})