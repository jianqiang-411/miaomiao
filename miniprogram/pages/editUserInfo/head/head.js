// miniprogram/pages/head/head.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: ""
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
    this.setData({
      userPhoto: app.userInfo.userPhoto
    });


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

  handleUploadImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        this.setData({
          userPhoto: tempFilePaths
        });

      }
    })
  },

  bindGetUserInfo(e) {
    let userInfo = e.detail.userInfo;

    this.setData({
      userPhoto: userInfo.avatarUrl
    }, () => {
      console.log("使用微信头像成功...");
      this.updateUserPhoto(this.data.userPhoto);
    });
  },


  handleButton() {

    wx.showToast({
      title: '上传中...',
    });

    let cloudPath = "userPhoto/" + app.userInfo._openid + ".jpg";

    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: this.data.userPhoto, // 文件路径
      success: res => {
        let fileID = res.fileID;
        if (fileID) {
          wx.hideLoading({
            complete: (res) => {
              wx.showToast({
                title: '上传成功',
              })
            },
          });

        
          this.updateUserPhoto(fileID);
        }
      },
      fail: err => {
        // handle error
      }
    })

  },

  async updateUserPhotoServerPath(fileID) {
     
    return new Promise(function(resolve, reject) {
      if (fileID.includes('cloud://')) {
        wx.cloud.getTempFileURL({
          fileList: [fileID],
          success: res => {
            // get temp file URL
            let userPhotoServerPath = res.fileList[0].tempFileURL + "?v=" + Date.now();
            return resolve(userPhotoServerPath);
          },
        })
      } else {
        return resolve(fileID);
      }
      
    });
     
},

  async updateUserPhoto(fileID) {

    let res = await this.updateUserPhotoServerPath(fileID);
    console.log('updateUserPhoto res: ', res);
    db.collection('users').doc(app.userInfo._id).update({
      data: {
        userPhoto: res
      }
    }).then((r) => {
      app.userInfo.userPhoto = res;

    });
    
  }


})