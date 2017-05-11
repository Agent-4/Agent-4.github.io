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

//Happy Coding Rain
window.onload = function CodingRain(){
    var canvas = document.getElementById("secretCode");
    var context = canvas.getContext("2d");
    var W = 245;
    var H = 100;
    canvas.width = W;
    canvas.height = H;
    var fontSize = 10;
    var colunms = Math.floor(W /fontSize);  
    var drops = [];
    for(var i=0; i<colunms; i++){
        drops.push(0);
    }
    /* The secret name. If you want to know, just crack it! */
    //surname
    var name0 = "0100 0111 ";
    var name1 = "0100 0001 ";
    var name2 = "0100 1111 ";
    //first name
    var name3 = "0100 1010 ";
    var name4 = "0100 1001 ";
    var name5 = "0100 0101";
    var str = name0+name1+name2+name3+name4+name5;
    //console.log(str);
    function draw(){
        context.fillStyle = "rgba(255,255,255,0.1)";
        context.fillRect(0,0,W,H);
        context.font = "40 "+fontSize+"px  黑体";
        context.fillStyle = "#00FF33";
        for(var i=0; i<colunms; i++){
            var index = Math.floor(Math.random() * str.length);
            var x = i*fontSize;
            var y = drops[i] *fontSize;
            context.fillText(str[index],x,y);
            if(y >= canvas.height && Math.random() > 0.99){
                drops[i] = 0;
            }
            drops[i]++;
        }
    };
    draw();
    setInterval(draw,40);
}


(function($) {
    $.fn.animatedHeadline = function(options) {
        var settings = $.extend({
            // Below are the default settings.
            animationType: "rotate-1",
            animationDelay: 2500,
            barAnimationDelay: 3800,
            barWaiting: 800,
            lettersDelay: 50,
            typeLettersDelay: 150,
            selectionDuration: 500,
            typeAnimationDelay: 1300,
            revealDuration: 600,
            revealAnimationDelay: 1500
        }, options );
        var duration = settings.animationDelay;
        this.each( function() {
            var headline = $(this);
            headline.find('.ah-headline').addClass(settings.animationType);
            singleLetters($('.ah-headline.letters').find('b'));
            
            //trigger animation
            setTimeout(function(){
                hideWord( headline.find('.is-visible').eq(0) )
            }, duration);
        });

        function singleLetters(words) {
            words.each(function(){
                var word = $(this),
                    letters = word.text().split(''),
                    selected = word.hasClass('is-visible');
                var newLetters = letters.join('');
                word.html(newLetters).css('opacity', 1);
            });
        }

        function hideWord(word) {
            var nextWord = takeNext(word);
            
            switchWord(word, nextWord);
            setTimeout(function(){
                hideWord(nextWord)
            }, settings.animationDelay);
        }

        function takeNext(word) {
            return (!word.is(':last-child')) ? word.next() : word.parent().children().eq(0);
        }

        function takePrev(word) {
            return (!word.is(':first-child')) ? word.prev() : word.parent().children().last();
        }

        function switchWord(oldWord, newWord) {
            oldWord.removeClass('is-visible').addClass('is-hidden');
            newWord.removeClass('is-hidden').addClass('is-visible');
        }
    };

}(jQuery));