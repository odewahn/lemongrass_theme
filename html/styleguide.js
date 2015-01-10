var orm = {};

orm.StyleGuideRouter = Backbone.Router.extend({

  routes: {
    "*path": "page"
  },

  page: function(path) {
    
    if(path) 
    {
      $.ajax({
        dataType: "text",
        url: "/pages/" + path,
        success: _.bind(function(data) {
          $("#styleguide-content").html(data);
        }, this)
      });  
    }
  }

});

orm.StyleGuideMenu = Backbone.View.extend({

  initialize: function()
  {
    this.load_navigation_json();
  },

  sorted_keys: function(obj) 
  {
    return _.keys(obj).sort();
  },  

  labelize : function(name)
  {
    if(name.match(/\d{2}-/g))
    {
      var split = name.split("-");
      split.shift();
      return split.join(" ").replace(".html", "");
    }
    else
    {
      return name.replace("-", " ").replace(".html", "");
    }
  },

  load_navigation_json : function()
  {
    $.ajax({
      dataType: "json",
      url: "/pages/pages.json",
      success: _.bind(this.render, this)
    });
  },

  object_to_list : function(v, k) {
    
    if(_.isString(v))
    {
      return "<li><a href='"+v+"' class='styleguide-link' data-link='"+v+"'>" + this.labelize(k) + "</a></li>"
    }
    else
    {
      return "<li class='parent'><a href='#'>" + this.labelize(k) + "</a><ul>" + _.map(v, this.object_to_list, this).join("") + "</ul></li>"
    }
  },

  render: function(data)
  {
    // render page.json into menu structure
    menu = _.map(this.sorted_keys(data), function(k) {
      return this.object_to_list(data[k], k)
    }, this).join("")

    // insert menu in page body
    this.$el.html("<ul>" + menu + "</ul>");
    var that = this;
    this.$(".styleguide-link").click(function(e) {
      that.clicked(e, this);
    });
  },

  clicked : function(e, el)
  {
    e.preventDefault();
    url = $(el).attr('data-link');
    window.router.navigate(url, {trigger: true});
  }

});


$(function(){
  
  window.router = new orm.StyleGuideRouter();
  Backbone.history.start({pushState: true});

  var menu = new orm.StyleGuideMenu({el:"#styleguide-menu"});
});