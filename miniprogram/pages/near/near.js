// miniprogram/pages/near/near.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    markers: []


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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserLocation();
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

  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        let latitude = res.latitude
        let longitude = res.longitude
        this.setData({
          longitude,
          latitude,
        }, () => {
          this.getNearUsers();
        });
      }
    })

  },

  getNearUsers() {
    db.collection('users').where({
      location: _.geoNear({
        geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
        minDistance: 0,
        maxDistance: 5000,
      }),
      isLocation: true
    }).field({
      userPhoto: true,
      nickName: true,
      longitude: true,
      latitude: true,
    }).get().then((res) => {

      let result = []

      if (res.data.length) {
        for (let i = 0; i < res.data.length; i++) {

          let longitude = res.data[i].longitude;
          let latitude = res.data[i].latitude;
          if (res.data[i]._id == app.userInfo._id) {
            longitude = this.data.longitude;
            latitude = this.data.latitude;
          }

          result.push({
            iconPath: res.data[i].userPhoto,
            id: res.data[i]._id,
            latitude,
            longitude,
            width: 30,
            height: 30
          });

          this.setData({
            markers: result
          });

        }
      }

    });
  },

  markertap(ev) {
    wx.navigateTo({
      url: '../detail/detail?userId=' + ev.markerId,
    })
  }
})