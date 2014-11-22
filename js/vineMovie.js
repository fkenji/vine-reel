var VineMovie = (function($) {
  
  function _VineMovie(spec) {
    this.$el = $(spec.source)
    this.domVideoElements = []
    this.videoUrls = spec.videoUrls
    this.muted = spec.muted || true
    this.currentVideo = 0
  }

  _VineMovie.prototype.build = function(){
    this.$reel = $("<div>")
    this.$reel.attr("class", "reel")
    this.$el.append(this.$reel)
    _addVideosToReel.call(this, this.$el, this.videoUrls);
  }


  _VineMovie.prototype.start = function() {
    $(this.domVideoElements[this.currentVideo]).show();
    this.domVideoElements[this.currentVideo].play();    
  }

  _VineMovie.prototype.playNext = function() {
    $(this.domVideoElements[this.currentVideo]).hide();

    var nextToPlay = (this.currentVideo + 1) % this.domVideoElements.length; 
    $(this.domVideoElements[nextToPlay]).show();
    this.domVideoElements[nextToPlay].play();
    this.currentVideo = nextToPlay;
  }


  function _addVideosToReel(sourceDiv, urls) {
    var domVideoElements = []
    var self = this;
    for(var i = 0; i < urls.length; i++){
      var $video = $("<video>")
      $video.attr('src', urls[i]);

      if(this.muted) {
        $video.attr('muted', 'muted');
      }

      $video.attr('preload', 'auto');

      $video.on('ended', function(){
        self.playNext()
      })

      $video.hide();

      // $video.data('next'); 
      this.domVideoElements.push($video.get()[0])
      sourceDiv.append($video);
    }

    
  }

  return _VineMovie;

})(jQuery);



     