$(document).ready(function(){
    console.log(widget_data);
    var cc = $('#cards-container');
    $('.card-front, .card-back, .flip').click(function() {
        flip();
    });
    $('.answer').click(function(){
        setAnswer($(this).attr('data-answer'));
    })
    if(!logged_in){
        $('.edit-card').hide();
    }
    function flip(){
        $('.flip').addClass('hide-if-small');
        if(cc.css('margin-left')=='0px'){
            cc.animate({
                'margin-left': '-99%',
            }, 500 );
            $('.were-you').css('display', 'inline-block');
        }else{
            cc.animate({
                'margin-left': '0%',
            }, 500 );
        }
    }


    function initialize_data(){
        if(!widget_data.card_knowledge){
            widget_data.card_knowledge = {};
        }
        var known = 0;
        deck.cards.forEach(function(card){
            if(!widget_data.card_knowledge[card._id]){
                widget_data.card_knowledge[card._id] = 0.5;
            }
            if(widget_data.card_knowledge[card._id]>.75){
                known++;
            }
        });
        widget_data.known = known;
        widget_data.deck_knowledge = known/deck.cards.length;
    }
    function right(){setAnswer(1)};
    function wrong(){setAnswer(-1)};
    function neutral(){setAnswer(0)};
    $(document).bind('keydown', 'a', flip);
    $(document).bind('keydown', 's', right);
    $(document).bind('keydown', 'd', wrong);
    $(document).bind('keydown', 'f', neutral);

    function setAnswer(answer){
        answer = Number(answer)
        initialize_data();
        if(typeof(current_top_of_stack_card)==='number'){
            var card = deck.top_of_stack[current_top_of_stack_card];
            if(!card){
                throw "No card!"
            }
            var card_knowledge = widget_data.card_knowledge[card._id];
            if((card_knowledge <= 0)||(card_knowledge>1)){
                card_knowledge = 0.5;
            }else{
                if(answer<0){
                    card_knowledge = 0.5 * card_knowledge;
                }
                if(answer>0){
                    card_knowledge = card_knowledge + ((1-card_knowledge)*0.6);
                }
            }
            widget_data.card_knowledge[card._id] = card_knowledge;
            updateDeckKnowledge();
            saveWidgetData(widget_data, function(result){
                console.log('result', result)
            });
        }
        showNextCard();

    }

    function updateDeckKnowledge(){
        var sum = 0;
        var count = 0;
        for(var id in widget_data.card_knowledge){
            sum += (widget_data.card_knowledge[id] > .7) ? 1 : 0;
            count ++;
        }
        widget_data.deck_knowledge = Math.ceil(10000*(sum/count))/100;
        if(!widget_data.deck_knowledge){
            widget_data.deck_knowledge = 0;
        }
        $('.knowledge-rating .fill').css('width', widget_data.deck_knowledge+'%').text(widget_data.deck_knowledge+'%');
    }
    updateDeckKnowledge();

    function shuffleDeck(){
        //doesn't change deck on server
        if(!widget_data.card_knowledge){
            widget_data.card_knowledge = {};
        }
        deck.cards.forEach(function(card){
            var k = widget_data.card_knowledge[card._id]; 
            if(!k){
                k = 0.5;
            }
            card.sort = k + (Math.random()/3);
        })
        deck.cards.sort(helpers.dynamicSort('sort'));
        deck.new_shuffle = true;
        deck.shuffled = true;
    }
    current_card = {};
    var current_top_of_stack_card = 0;
    function getNextCard(){
        if(!deck.shuffled){
            shuffleDeck();
        }
        if(!deck.top_of_stack){
            deck.top_of_stack = [];
        }
        var top_of_stack_size = 6;
        if(top_of_stack_size > deck.cards.length){
            top_of_stack_size = deck.cards.length;
        }
        if(deck.new_shuffle){
            deck.new_shuffle = false;
            for(var i = 0; i < top_of_stack_size; i++){
                deck.top_of_stack[i] = deck.cards[i];
            }
            helpers.shuffle(deck.top_of_stack);
            current_top_of_stack_card = -1;
        }
        
        current_top_of_stack_card++;
        if(current_top_of_stack_card>=top_of_stack_size){
            current_top_of_stack_card = 0;
            deck.shuffled = false;
        }
        current_card = deck.top_of_stack[current_top_of_stack_card];
        return current_card;
    }

    function showNextCard(first){
        $('.card').hide();
        cc.css({
            'margin-left': '0%',
        });
        $('.were-you').hide();
        $('.flip').removeClass('hide-if-small');
        var card = getNextCard();
        $(".card-front .content").html(card.front);
        $(".card-back .content").html(card.back);
        $(".edit-card").attr('data-id', card._id);
        setTimeout(function(){
            $('.card').show();
            var font_size = 50;
            $('.card').css('font-size', font_size+'px');
            var acceptable_height = $(window).height()*.60;
            if(acceptable_height<300){
                acceptable_height = 300;
            }
            while((font_size > 10) && ($('.card-front').height()>acceptable_height)){
                console.log(font_size)
                font_size -= 5;
                $('.card').css('font-size', font_size+'px');
            }
    
        }, 300);
    }
    showNextCard(true);
});
