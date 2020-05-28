// components/removeList/removeList.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    messageId: String,
    id: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    userMessage: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    removeMessage() {
      wx.cloud.callFunction({
        name: 'update',
        data: {
          collection: 'message',
          where: {
            userId: app.userInfo._id
          },
          data: `{list: _.pull('${this.data.userMessage._id}')}`
        }
      }).then((res) => {
        wx.showToast({
          title: '删除成功',
        })

        //移除 wxml
        this.triggerEvent("del", {id: this.data.id});

      });
    },

    handleDelete() {
      wx.showModal({
        title: '提示',
        content: '删除该项',
        confirmText: '删除',
        success: (res) => {
          if (res.confirm) {
            this.removeMessage();

          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })

    },

    handleAddFriend() {
      wx.showModal({
        title: '提示',
        content: '好友申请',
        confirmText: '同意',
        success: (res) => {
          if (res.confirm) {

            db.collection('users').doc(app.userInfo._id).update({
              data: {
                friendList: _.unshift(this.data.messageId)
              }
            }).then((res)=>{});

            wx.cloud.callFunction({
              name: 'update',
              data: {
                collection: 'users',
                doc: this.data.messageId,
                data: `{friendList: _.unshift('${app.userInfo._id}')}`
              }
            }).then((res)=>{})
            
            this.removeMessage();

          } else if (res.cancel) {}
        }
      })
    },

  },

  lifetimes: {

    attached: function() {
      // 在组件实例进入页面节点树时执行
      db.collection('users').doc(this.data.messageId).get().then((res) => {
        this.setData({
          userMessage: res.data
        });
      });
    },
  },

})
