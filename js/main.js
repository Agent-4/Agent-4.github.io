(function($){
    // Caption
    $('.article-entry').each(function(i){
        $(this).find('img').each(function(){
            if ($(this).parent().hasClass('fancybox')) {
                return;
            }
            var alt = this.alt;
            if (alt) {
                $(this).after('<span class="caption">' + alt + '</span>');
            }

            $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
        });

        $(this).find('.fancybox').each(function(){
            $(this).attr('rel', 'article' + i);
        });
    });
    if ($.fancybox){
        $('.fancybox').fancybox();
    }

    // Profile card
    $(document).on('click', function () {
        $('#profile').removeClass('card');
    }).on('click', '#profile-anchor', function (e) {
        e.stopPropagation();
        $('#profile').toggleClass('card');
    }).on('click', '.profile-inner', function (e) {
        e.stopPropagation();
    });

})(jQuery);

//musiclist
function page1(){
    document.getElementById('music-list1').style.cssText="display: block";
    document.getElementById('music-list2').style.cssText="display: none";
    document.getElementById('music-list3').style.cssText="display: none";
    document.getElementById('music-list4').style.cssText="display: none";

    document.getElementById('music-list1-page').style.cssText="font-size:12px; color: #e67466; border: 1px solid #e67466 ";
    document.getElementById('music-list2-page').style.cssText="border: 1px solid color-border";
    document.getElementById('music-list3-page').style.cssText="border: 1px solid color-border";
    document.getElementById('music-list4-page').style.cssText="border: 1px solid color-border";
}
function page2(){
    document.getElementById('music-list1').style.cssText="display: none";
    document.getElementById('music-list2').style.cssText="display: block";
    document.getElementById('music-list3').style.cssText="display: none";
    document.getElementById('music-list4').style.cssText="display: none";

    document.getElementById('music-list1-page').style.cssText="color:#aaa; border: 1px solid color-border";
    document.getElementById('music-list2-page').style.cssText="font-size:12px; color: #e67466; border: 1px solid #e67466 ";
    document.getElementById('music-list3-page').style.cssText="border: 1px solid color-border";
    document.getElementById('music-list4-page').style.cssText="border: 1px solid color-border";
}
function page3(){
    document.getElementById('music-list1').style.cssText="display: none";
    document.getElementById('music-list2').style.cssText="display: none";
    document.getElementById('music-list3').style.cssText="display: block";
    document.getElementById('music-list4').style.cssText="display: none";

    document.getElementById('music-list1-page').style.cssText="color:#aaa; border: 1px solid color-border";
    document.getElementById('music-list2-page').style.cssText="border: 1px solid color-border";
    document.getElementById('music-list3-page').style.cssText="font-size:12px; color: #e67466; border: 1px solid #e67466 ";
    document.getElementById('music-list4-page').style.cssText="border: 1px solid color-border";
    
}
function page4(){
    document.getElementById('music-list1').style.cssText="display: none";
    document.getElementById('music-list2').style.cssText="display: none";
    document.getElementById('music-list3').style.cssText="display: none";
    document.getElementById('music-list4').style.cssText="display: block";

    document.getElementById('music-list1-page').style.cssText="color:#aaa; border: 1px solid color-border";
    document.getElementById('music-list2-page').style.cssText="border: 1px solid color-border";
    document.getElementById('music-list3-page').style.cssText="border: 1px solid color-border";
    document.getElementById('music-list4-page').style.cssText="font-size:12px; color: #e67466; border: 1px solid #e67466 ";
}
