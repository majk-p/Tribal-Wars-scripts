// ==UserScript==
// @name        TribalWars-quickbar
// @namespace   http://example.net
// @include     *.plemiona.pl/game.php?*
// @require     http://code.jquery.com/jquery-1.9.1.min.js
// @require     http://cdn.jquerytools.org/1.2.7/full/jquery.tools.min.js
// @require     http://github.com/andris9/jStorage/raw/master/jstorage.js
// @resource    style https://raw.githubusercontent.com/majk-p/Tribal-Wars-scripts/master/static/style.css
// @resource    qbar https://raw.githubusercontent.com/majk-p/Tribal-Wars-scripts/master/static/quickbar.html
// @resource    settings https://raw.githubusercontent.com/majk-p/Tribal-Wars-scripts/master/static/settings.html
// @version     1
// @grant       GM_getResourceText
// @grant       GM_addStyle
// ==/UserScript==



function gup(name) {
    name = name.replace(/[\[]/, '\[') .replace(/[\]]/, '\]');
    var regexS = '[\?&]' + name + '=([^&#]*)';
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
    return '';
     else
    return results[1];
}

function ucFirst(string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
}

$(function () {
    console.log("starting");
    GM_addStyle(GM_getResourceText('style'));
    $('.maincell') .prepend(GM_getResourceText('qbar') .split('VILID') .join(gup('village')));
    $("body").append(GM_getResourceText('settings'));
    

    $("a[rel=#settings]").overlay({mask: '#000'});
    
    //hiding tab content except first one
    $("#tabs div.tab_content").not(":first").hide();
    // adding Active class to first selected tab and show
    $("#tabs ul li:first").addClass("active").show(); 
 
    // Click event on tab
    $("#tabs ul li").click(function() {
        // Removing class of Active tab
        $("#tabs ul li.active").removeClass("active");
        // Adding Active class to Clicked tab
        $(this).addClass("active");
        // hiding all the tab contents
        $("#tabs div.tab_content").hide();       
        // showing the clicked tab's content using fading effect
        $($('a',this).attr("href")).fadeIn('slow');
 
        return false;
    });
    
    // tab selection
    
    // tabs actions
    
    $("#tabs-1 #target_attack").click(function(e){   // saving settings for farming script
        e.preventDefault();
        $("#tabs-1 .unitsInput").each(function(){
            var arr = $(this).attr("id").split("_");
            $.jStorage.set("farm"+ucFirst(arr[arr.length-1]), $(this).val());
            console.log("farm"+ucFirst(arr[arr.length-1])+"  "+$(this).val());
        });
        var pattern = /\d{3}\|\d{3}/; 
        var cords = new Array();
        var data= $("#tabs-1 textarea").val().split(",");
        for(var i=0; i<data.length; i++){
            data[i]=$.trim(data[i]);
            console.log(data[i]+" "+pattern.test(data[i]));
            if(pattern.test(data[i])) cords.push(data[i]);
        }
        $.jStorage.set('cords', JSON.stringify(cords));
        alert("Zapisano");
    });

    // tabs content
    //    tabs-1 content
    $("#tabs-1 .unitsInput").each(function(){
        var arr = $(this).attr("id").split("_");
        $(this).val($.jStorage.get("farm"+ucFirst(arr[arr.length-1])));
    });
    var textareaData = "";
    for(var i=0; i< JSON.parse($.jStorage.get('cords')).length; i++){
        textareaData = textareaData + JSON.parse($.jStorage.get('cords'))[i] + ", ";
    }
    $("#tabs-1 textarea").val(textareaData);
    //   eof tabs-1 
    console.log("done");
});
