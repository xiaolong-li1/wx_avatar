//index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
//获取应用实例
Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    imgUrl: ['../img/02.png', '../img/05.png', '../img/01.png', '../img/04.png',
      '../img/06.png', '../img/03.png', '../img/07.png', '../img/08.png', '../img/09.png'],
    backgroundImgSrc: '',     //从本地获取的背景图片的路径
    tplImgSrc: '',            //校徽模板对应的图片路径
    isShowChooseImg: false,
    isShowContainer: false,
    isShowCanvas: false,
    isShowSuccess: false,
    isShowCheerTime: true,
    cheerTime: '',
  },
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail 
      this.setData({
        avatarUrl,
      })
      this.setData({
        backgroundImgSrc:avatarUrl
      })
    },
    onShow: function () {
      var now = new Date();
      var year = new Date('2018/06/26');
      if (Math.ceil((year.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)) == 0 ) {
        this.setData({
          isShowCheerTime: false,
        })
      }else {this.setData({
        cheerTime: Math.ceil((year.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        });
      }
  },
  //从本地图库选择图片的事件处理函数
  
  getLocalImg: function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:  (res) => {   //防止this改变
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        this.setData({
          isShowContainer: false,
          backgroundImgSrc: tempFilePaths[0],   //这是一个数组
        })
      }
    })
  },

  //点击校徽模板时调用的函数
  showChooseImg: function (e) {
    
    if (this.data.isShowChooseImg == false) {
      this.setData({
        isShowChooseImg: true,
      })
    }
   
    
    
    var temp = e.target.dataset;
    this.setData({
      tplImgSrc: temp.img,
    })
  },
  drawAfter:  ()=>  {
    wx.canvasToTempFilePath({
      width: 1000,
      heght: 1000,
      destWidth: 1000,  
      destHeight: 1000,
      canvasId: 'myCanvas',
      fileType: 'jpg',
      quality: 10,
      success: (res) => {
        console.log(1);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => { // 添加 success 回调函数
            wx.showModal({ // 调用 wx.showModal 方法
              title: '提示', // 设置标题
              content: '照片已经在相册里了', // 设置内容
              showCancel: false, // 不显示取消按钮
              confirmText: '善哉', // 设置确认按钮的文字
              confirmColor: '#576B95', // 设置确认按钮的颜色
              success: (res) => { // 设置 success 回调函数
                if (res.confirm) { // 如果用户点击了确定按钮
                  console.log('用户点击确定');
                }
              }
            })
          }
        });

      },
      fail: function (res) {
        console.log(res);
      },
    })

  },

  // post: function test() {
  //   var value = document.getElementById('username').value;
  //   var xmlHttp = new XMLHttpRequest();
  //   xmlHttp.onreadystatechange = function () {
  //     if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
  //       test.innerHTML = xmlHttp.responseText;
  //     }
  //   };

  //   xmlHttp.open('POST', 'http://127.0.0.1:3000/', true);
  //   xmlHttp.send(value);      //吧image发送过去
  // },
  //点击生成图片时用Canvas将两个图片绘制成Canvas然后保存
  saveImg: function () {
    
    this.setData({
      isShowCanvas: true,
    });
    setTimeout(() => {   //这里用异步来实现,不然会提示canvas为空
      var context = wx.createCanvasContext('myCanvas');

      context.save();
      
      context.arc(500, 500, 400, 0, 2 * Math.PI);     //画一个半径为R的圆
      //从画布上裁剪出这个圆形
       context.clip();
      // context.drawImage(this.data.backgroundImgSrc[0], 21, 21, 128, 132);
      context.drawImage(this.data.backgroundImgSrc, 100,100,800, 800);
      context.restore();
      context.drawImage(this.data.tplImgSrc, 0,0, 1000, 1000);
      context.draw();
      setTimeout(() => {
        this.drawAfter();
      }, 200);
      setTimeout(() => {
        this.setData({
          isShowCanvas: false,
        });
        this.setData({
          isShowChooseImg: false,
        })
      }, 500);
    }, 50)      //时间0ms，10ms不行，什么鬼？

  },

})