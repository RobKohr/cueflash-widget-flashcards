$(document).ready(function(){
    console.log("ARE WE HERE");
    var git_assets_url = 'https://cdn.rawgit.com/';
    var assets_url = git_assets_url+ 'RobKohr/cueflash-widget-flashcards/master/';
    assets_url = './';
    var css_url = assets_url + 'widget.css';
    var css = '<link href="'+css_url+'" type="text/css" rel="stylesheet" />';
    $(css).appendTo('head')
   console.log('TEST', assets_url + 'widget.html' )
    $.ajax({ 
        url: assets_url + 'widget.html', 
        success: function(data) { 
            console.log('loaded')
            console.log(data);
            $('#widget-content-area').html(data); 
            var script_url = assets_url + 'widget.js';
            var script = '<script src="'+script_url+'"></script>';
            $(script).appendTo('body');
        } 
    });
})