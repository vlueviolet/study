// Youtube API Player
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player // CHALLENGE

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtubeVideo', {
        videoId: 'valS3LvjLhg',
        playerVars: { 'autoplay': 0, 'controls': 0, 'showinfo': 0, 'rel': 0, 'wmode': 'transparent', 'modestbranding': 1, 'enablejsapi': 1, 'html5': 1, 'origin': "http://" + location.host },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(e) {
    // e.target.mute();
    e.target.setPlaybackQuality('highres');
}
var done = false;

function onPlayerStateChange(e) {
    var frm = $(e.target.getIframe());
    if (e.data === YT.PlayerState.ENDED) {
        if ('youtubeVideo' === frm.attr('id')) {
            player.playVideo();
        }
        done = true;
    }
    if (e.data === YT.PlayerState.BUFFERING) {
        if ('youtubeVideo' === frm.attr('id')) {
            player.setPlaybackQuality('hd720');
        }
    }
    if (event.data == YT.PlayerState.PLAYING && !done) {
        done = true;
    }
}