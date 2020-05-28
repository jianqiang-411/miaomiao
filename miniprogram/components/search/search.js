// components/search/search.js

const app = getApp();
const db = wx.cloud.database();

Component({
  options: {
    styleIsolation: "apply-shared"
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false,
    searchList: [],
    searchHistory: [],
    inputValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus() {
      this.setData({
        isFocus: true,
      });

      wx.getStorage({
        key: 'searchHistory',
        success: (res) => {
          this.setData({
            searchHistory: res.data
          });
        }
      })

    },

    handleConfirm(e) {
      console.log(e.detail.value);

      let value = e.detail.value;
      let _serchData = [...this.data.searchHistory];
      _serchData.unshift(value);
      this.setData({
        searchHistory: [...new Set(_serchData)]
      });

      wx.setStorage({
        key: "searchHistory",
        data: this.data.searchHistory
      })

      this.searchData(value);

    },

    handleCancel() {
      this.setData({
        isFocus: false,
        inputValue: '',
        searchList: []
      });
    },

    handleDeleteHistory() {
      wx.removeStorage({
        key: 'searchHistory',
        success: (res) => {
          this.setData({
            searchHistory: []
          });
        }
      })

    },

    handleSelectSearchItem(e) {
      let text = e.target.dataset.text;
      this.setData({
        inputValue: text
      });
      this.searchData(text);

    },

    searchData(value) {
      db.collection('users').where({
        nickName: db.RegExp({
          regexp: value,
          options: 'i',
        })
      }).field({
        userPhoto: true,
        nickName: true
      }).get().then((res) => {
        this.setData({
          searchList: res.data
        });

      });
    }

  }
})
