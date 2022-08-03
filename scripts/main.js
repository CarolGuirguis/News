
var countriescomponent = {

data: [],
chosencountry:"",

init: function () {
    this.cacheElements();
    this.bindEvents();
    this.fetchdata();
    
    
  },
  cacheElements: function () {
   
    this.$countries = $("#countries-module");
   
    
    this.$loader=$("#loader");
    this.$carousel = $("#carinner");
    this.carouseltemplate=$("#slider-template").html();
  },
  bindEvents: function () {
   
    this.$carousel.on("click", "div.carousel-item",this.shownews.bind(this));
  },
  shownews:function(e){
   
    this.$loader.addClass("display");
    var country=e.currentTarget.id
    this.chosencountry=this.data.find(d => d.cca2 == country);
    eventsMediator.emit("news.show", this.chosencountry);
    
  },
  render: function () {
   
    this.$carousel.html(Mustache.render(this.carouseltemplate, { countries: this.data }));
    $('.carousel-item').first().addClass('active');
    
  },
  trial: function () {
    
  },
  fetchdata: function () {
    fetch('https://restcountries.com/v3.1/all/')
      .then(response => response.json())
      .then(response => {
        this.data=response
        console.log(response);
        this.render();
      }
        )
      .catch(err => console.error(err));
      
  }
 

}
var newscomponent={
  data:[],
  init: function () {
    this.cacheElements();
    this.bindEvents();
  },

  cacheElements:function(){
      this.$news = $("#news-module");
      this.$emptynews = $("#emptynews-module");
      this.template = $("#news-template").html();
      this.emptytemplate = $("#emptynews-template").html();
      this.$loader=$("#loader");
    },
    bindEvents:function(){
      eventsMediator.on("news.show", this.showcountrynews.bind(this));
    },
    render: function () {
      if(this.data.length==0){
        this.$emptynews.html(Mustache.render(this.emptytemplate, {text:"No News available."}));
      }
      else{
        
          this.$emptynews.html(Mustache.render(this.emptytemplate, {text:""}));
        
      }
     
      this.$news.html(Mustache.render(this.template, { news: this.data}));
      
      
      this.$loader.removeClass("display");
    },
    showcountrynews:function(data){
      var url="https://newsapi.org/v2/top-headlines?country="+data.cca2.toLowerCase()+
      "&apiKey=29c976c6813b408bbaea06be29de90be";
    fetch(url)
    .then(response => response.json())
    .then(data => {
      
      this.data=data.articles
      this.render();
        
    })
    .catch(err => console.error(err));
    }
  
}
var countrycomponent={
  data:[],
  init: function () {
    this.cacheElements();
    this.bindEvents();
  },

  cacheElements:function(){
      this.$country = $("#country-module");
      this.template = $("#country-template").html();
    },
    bindEvents:function(){
      eventsMediator.on("news.show", this.render.bind(this));
      
    },
    render: function (data) {
     
      var language= Object.entries(data.languages)
      var lang="";
      language.map(function(l){
        if(lang!="")
        lang+=","
       lang+= l[1];
      });
      data.language=lang;
      var currency= Object.entries(data.currencies)
      var curr="";
      currency.map(function(l){
        if(curr!="")
        curr+=","
        curr+=l[1].name;
      });
      data.currency=curr;
      this.$country.html(Mustache.render(this.template, { country: data}));
    }
  
}
var eventsMediator = {
  events: {},
  on: function (eventName, callbackfn) {
    this.events[eventName] = this.events[eventName]
      ? this.events[eventName]
      : [];
    this.events[eventName].push(callbackfn);
    
  },
  emit: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (callBackfn) {
        callBackfn(data);
      });
    }
  },
};

countriescomponent.init();
newscomponent.init();
countrycomponent.init();