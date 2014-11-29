var VineMovie = (function($) {
  
  function _VineMovie(spec) {
    this.$el = $(spec.source)
    this.domVideoElements = []
    this.videoUrls = spec.videoUrls
    this.muted = spec.muted || true
    this.currentVideo = 0
    this.step = this.step || 0.01

    if(spec.ajaxLoaderUrl) {
      var img = new Image();
      img.src = spec.ajaxLoaderUrl;
      this.ajaxLoader = img;
    } else {
      this.ajaxLoader = "Loading..."
    }
    
  }

  _VineMovie.prototype.build = function(){
    _formatVideosToReel.call(this);
  
    var self = this;
    var readyInterval = setInterval(function() {
      var elems = self.$el.find("video.reel-clip");
      var readyElems = $.grep(elems, function(ele) {
        return ele.readyState > 1
      });  

      if(readyElems.length === self.$el.find("video.reel-clip").length) {
        clearInterval(readyInterval)
        _setReadyStatus.call(self);
      }
    })
  }

  _VineMovie.prototype.start = function() { 
    // this.play();
  }

  _VineMovie.prototype.allVideos = function() {
    return this.$el.find("video.reel-clip");
  }

  _VineMovie.prototype.currentDomVideo = function() {
    return this.$el.find("video.reel-clip").get(this.currentVideo)
  }

  _VineMovie.prototype.playNext = function() {
    _hideAllVideos.call(this);

    _updateCurrentVideoCounter.call(this)    

    this.play();
  }

  _VineMovie.prototype.play = function() {
    $(this.currentDomVideo()).show();
    this.currentDomVideo().play();
  }




  //private methods
  function _hideAllVideos() {
    $(this.$el.find("video")).hide();    
  }

  function _updateCurrentVideoCounter() {
    this.currentVideo = (this.currentVideo + 1) % this.$el.find("video.reel-clip").length;  
  }

  function _formatVideosToReel() {
    var $videos = this.$el.find('video'),
        reel = this;

        _setLoadingStatus.call(this)
    
    for(var i = 0; i < $videos.length; i++) {
      $videos.eq(i).hide();
      $videos.attr('preload', 'metadata')
      $videos.eq(i).addClass('reel-clip')
      $videos.eq(i).on('ended', function(){
        reel.playNext()
      });

      if(jQuery.ui) {
        $videos.eq(i).on('remove', function(){
          var videoIsCurrentlyPlaying = !this.paused;
          if(videoIsCurrentlyPlaying) {
            reel.currentVideo = reel.currentVideo - 1            
            _removeVideoFromReel(this)
            reel.playNext();
          }
        });
      }
    }
  }

  function _setLoadingStatus() {
    _hideAllVideos.call(this);
    this.$el.prepend(this.ajaxLoader)
  }

  function _setReadyStatus() {
    $(this.ajaxLoader).hide();
    this.play();
    _addVideoControls.call(this);
  }

  function _removeVideoFromReel(video) {
    $(video).removeClass('reel-clip')
  }

  function _addVideoControls() {
    var $controls = $("<input type='range' min='0' step='"+ this.step + "'>");
    $controls.attr('max', 100)
    this.$el.append($controls);
  }

  return _VineMovie;

})(jQuery);