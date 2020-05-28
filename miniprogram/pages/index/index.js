// miniprogram/pages/index/index.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerListData: [],
    listData: [],
    current: 'links'

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
    this.getListData();
    this.getBannerListData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  handleLinks(e) {
    let id = e.target.dataset.id;

    wx.cloud.callFunction({
      name: 'update',
      data: {
        collection: 'users',
        doc: id,
        data: '{links: _.inc(1)}'
      }
    }).then((res) => {
      console.log(res);
      let updated = res.result.stats.updated;
      if (updated) {
        let cloneListData = [...this.data.listData];
        for (let i = 0; i < cloneListData.length; i++) {
          if (cloneListData[i]._id == id) {
            cloneListData[i].links++;
            break;
          }
        }
        this.setData({
          listData: cloneListData
        });
      }
    });
  },

  handleCurrennt(e) {
    let cur = e.target.dataset.current;

    if (cur != this.data.current) {
      this.setData({
        current: cur
      }, () => {
        this.getListData();
      });
    }

  },
  getListData() {
    db.collection('users').field({
      nickName: true,
      userPhoto: true,
      links: true
    })
      .orderBy(this.data.current, 'desc')
      .get()
      .then((res) => {
      
        this.setData({
          listData: res.data
        });

      });
  },

  getBannerListData() {
    db.collection('banner')
      .get()
      .then((res) => {
        this.setData({
          bannerListData: res.data
        });

      });
  },

  handelDetail(e) {
    let id = e.target.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?userId=' + id,
    })

  },
})