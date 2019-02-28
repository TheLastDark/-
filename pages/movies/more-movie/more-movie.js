var app = getApp()
var util = require('../../../utils/utils.js')
Page({

  data: {
    navigateTitle: "",
    movies:"",
    requestUrl:"",
    isEmpty:true,
    totalCount:0
  },
  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映": dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映": dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250": dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData)
  },
  onScrollLower:function(){
    var nextUrl = this.data.requestUrl+"?start="+this.data.totalCount+"&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh:function(){
    var refreshUrl = this.data.requestUrl +"?start=0&count=20";
    this.data.movies = {};
    this.data.totalCount=0;
    this.data.isEmpty = true;
    util.http(refreshUrl, this.processDoubanData)
    wx.showNavigationBarLoading();
  },
  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var tmp = {
        stars: util.covertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(tmp);
    }
    var totalMovies ={}
    //合并旧的数据
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
    }else{
      totalMovies=movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies:totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success: function (res) {

      }
    })
  },

  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id='+movieId,
    })
  }
})