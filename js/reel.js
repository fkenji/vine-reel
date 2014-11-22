var Reel = (function($) {
  
  function _Reel(spec) {
    this.$el = $(spec.source)
    this.domVideoElements = []
    this.videoUrls = spec.videoUrls
    this.muted = spec.muted || true
    this.currentVideo = 0
  }

  _Reel.prototype.build = function(){
    this.$reel = $("<div>")
    this.$reel.attr("class", "reel")
    this.$el.append(this.$reel)
    _addVideosToReel.call(this, this.$el, this.videoUrls);
  }

  _Reel.prototype.start = function() {
    this.playNext()
  }

  _Reel.prototype.playNext = function() {
    this.domVideoElements[this.currentVideo++ % this.domVideoElements.length].play()
  }


  function _addVideosToReel(sourceDiv, urls) {
    var domVideoElements = []
    for(var i = 0; i < urls.length; i++){
      var $video = $("<video>")
      $video.attr('src', urls[i]);

      if(this.muted) {
        $video.attr('muted', 'muted');
      }

      $video.attr('preload', 'auto');

      $video.on('ended', function(){
        console.log('ended')
      })

      // $video.data('next'); 
      this.domVideoElements.push($video.get()[0])
      sourceDiv.append($video);
    }

    
  }

  return _Reel

})(jQuery);
