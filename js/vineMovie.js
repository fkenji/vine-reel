var VineMovie = (function($) {
  
  function _VineMovie(spec) {
    this.$el = $(spec.source)
    this.domVideoElements = []
    this.videoUrls = spec.videoUrls
    this.muted = spec.muted || true
    this.currentVideo = 0
    this.step = this.step || 0.01
  }

  _VineMovie.prototype.build = function(){
    _formatVideosToReel.call(this);
    _addVideoControls.call(this);
  }

  _VineMovie.prototype.start = function() {
    this.play();
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
    
    for(var i = 0; i < $videos.length; i++) {
      $videos.eq(i).hide();
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