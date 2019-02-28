var util = require("../../utils/utils.js");
var app = getApp();
Page({
  data:{
    inTheaters:{},
    comingSoonUrl:{},
    top250:{},
    containerShow:true,
    searchPanelShow:false,
    searchResult:{}
  },
  onLoad: function (event) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250 = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
    this.getMovieListData(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieListData(top250,"top250","豆瓣Top250");
  },
  onMoreTap:function(event){
    var category=event.currentTarget.dataset.category
    wx.navigateTo({
      url:"../movies/more-movie/more-movie?category="+category
    })  
  },
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    console.log(event)
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getMovieListData: function (url,settedKey,categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        console.log(res)
        that.procesDoubanData(res.data,settedKey,categoryTitle)
      },
      fail() {
        console.log("failed")
      }
    })
  },
  onBindFocus:function(){
    this.setData({
      containerShow:false,
      searchPanelShow:true
    })
  },
  onCancelImgTap:function(){
    this.setData({
      containerShow:true,
      searchPanelShow:false
      // searchResult: {}
    })
  },
  onBindBlur:function(event){
    var text= event.detail.value;
    var searchUrl = app.globalData.doubanBase+"/v2/movie/search?tag=" +text;
    this.getMovieListData(searchUrl,"searchResult","")
  },
  procesDoubanData: function (moviesDouban,settedKey,categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var tmp = {
        stars:util.covertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(tmp);
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle:categoryTitle,
      movies:movies}
    this.setData(readyData);
  }
})