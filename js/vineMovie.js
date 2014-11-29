var VineMovie = (function($) {
  
  function _VineMovie(spec) {
    this.$el = $(spec.source)
    this.domVideoElements = []
    this.videoUrls = spec.videoUrls
    this.muted = spec.muted || true
    this.currentVideo = 0
    this.controlStep = spec.controlStep || 0.01

    if(spec.ajaxLoaderUrl) {
      var img = new Image();
      img.src = spec.ajaxLoaderUrl;
      this.ajaxLoader = img;
    } else {
      this.ajaxLoader = "Loading..."
    }
    
  }

  _VineMovie.prototype.start = function(){
    _formatVideosToReel.call(this);
    this.ready(function() {
      $(this.ajaxLoader).hide();
      this.play();
      _addVideoControls.call(this);      
    })
  }


  _VineMovie.prototype.allVideos = function() {
    return this.$el.find("video.reel-clip");
  }

  _VineMovie.prototype.currentDomVideo = function() {
    return this.allVideos().get(this.currentVideo)
  }

  _VineMovie.prototype.playNext = function() {
    _hideAllVideos.call(this);
    this.currentDomVideo().pause();
    _updateCurrentVideoCounter.call(this)    
    this.play();
  }

  _VineMovie.prototype.play = function() {
    $(this.currentDomVideo()).show();
    this.currentDomVideo().play();
  }

  _VineMovie.prototype.stop = function() {
   this.currentDomVideo().pause(); 
  }

  _VineMovie.prototype.isPlaying = function() {
    return !(this.currentDomVideo().paused)
  }

 _VineMovie.prototype.ready = function(callback) {
    var self = this;
    var readyInterval = setInterval(function() {
      var numberOfVideosReady = $.grep(self.allVideos(), function(ele) {
        return ele.readyState > 1
      });  

      if(numberOfVideosReady.length === self.allVideos().length) {
        clearInterval(readyInterval);
        callback.call(self);
      }
    })    
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
      $videos.attr('preload', 'metadata');
      $videos.eq(i).addClass('reel-clip');
      $videos.eq(i).attr('data-order', i);
      $videos.eq(i).on('ended', function(){
        reel.playNext();
      });

      $videos.eq(i).on('timeupdate', function(event) {
        var order = $(reel.currentDomVideo()).data('order');
        var currentTime = reel.currentDomVideo().currentTime;
        reel.$controls.val(_getMaxLengthUpto(reel.allVideos(), order) + currentTime)
        
      })

      $videos.eq(i).on('click', function() {
        if(reel.isPlaying()) {
          reel.stop();
        } else{
          reel.play();
        }
      });

      if(jQuery.ui) {
        $videos.eq(i).on('remove', function(){
          var videoIsCurrentlyPlaying = !this.paused;
  

          _removeVideoFromReel(this);
          _reassignReelOrder.call(reel);
          _updateControls.call(reel);
          reel.currentVideo = 0;
          reel.$controls.val(0)
          reel.play();
          // reel.stop();
          
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

  function _updateControls() {
    this.$controls.attr('max', _getMaxLengthFrom(this.allVideos()));
  }

  function _removeVideoFromReel(video) {
    $(video).removeClass('reel-clip')
  }

  function _reassignReelOrder() {
    var $videos = this.allVideos();
    for(var i = 0; i < $videos.length; i++) {
      $videos.eq(i).attr('data-order', i);
    }
  }

  function _addVideoControls() {
    var $controls = $("<input type='range' class='reel-clip-control' min='0' step='"+ this.controlStep + "'>");
    $controls.attr('max', _getMaxLengthFrom(this.allVideos()));
    $controls.val(0);

    var self = this;

    $controls.on('mousedown', function(event) {
      self.stop();
    });

    $controls.on('input', function(event) {
      
      var videoInfo = _getVideoFromDuration(self.allVideos(), event.target.value);
      
      if(videoInfo){
         _hideAllVideos.call(self);  
        self.currentVideo = videoInfo.videoOrder;
        self.currentDomVideo().currentTime = videoInfo.seektime
        self.play()
      }
    });
    this.$controls = $controls;
    this.$el.append($controls);
  }


  function _getVideoFromDuration($videos, duration) {    
    var total = 0;
    for(var i = 0; i < $videos.length; i++) {
      if(duration >= total && duration <= ($videos.get(i).duration + total) ) {
        return { videoOrder: $videos.eq(i).data('order'), seektime: (duration - total) }
      }
      total += $videos.get(i).duration
    }
    return null;    
  }

  function _getMaxLengthFrom($videos, position) {
    var total = 0;
    for(var i = 0; i < $videos.length; i++) {
      total += $videos.get(i).duration
    }
    return total;
  }

  function _getMaxLengthUpto($videos, position) {
    var total = 0;
    for(var i = 0; i < position; i++) {
      total += $videos.get(i).duration
    }
    return total;
  }  

  return _VineMovie;

})(jQuery);