$(document).ready(function(){
    $('.delete-card').click(function(){
        var card_id = $(this).attr('data-id');
        $('.'+card_id).hide('fast');
        $.getJSON(deck.link+'/actions/delete-card/'+card_id);
    });
    
    $('.copy-deck').click(function(){
        $('#copy-deck-form').toggle('fast');
    })
    var current_card_editing = null;
    $('.card-actions .edit-card, .edit-card').click(function(event){
        event.stopPropagation();
        clearAndHideModal();
        var card_id = $(this).attr('data-id');
        console.log('clicked', card_id)
        current_card_editing = card_id;
        var card = getCardById(card_id);
        $('[name="front"]').val(card.front);
        $('#edit-card-modal .front .trumbowyg-editor').html(card.front);
        $('[name="back"]').val(card.back);
        $('#edit-card-modal .back .trumbowyg-editor').html(card.back);
        $('#edit-card-modal').show();
    })

    function setClientCardValues(card_updates){
        deck.cards.forEach(function(card){
            if(card_updates._id === card._id){
                card.front = card_updates.front;
                card.back = card_updates.back
            }
        })
        $('.'+card_updates._id+'.term-front .content, .card-front .content').hide('fast').html(card_updates.front).show('fast');
        $('.'+card_updates._id+'.term-back .content, .card-back .content').hide('fast').html(card_updates.back).show('fast');
        clearAndHideModal();
    }

    function getCardById(id){
        var out = null;
        deck.cards.forEach(function(card){
            if(card._id === id){
                out = card;
            }
        })
        return out;
    }

    $('.save-edit-card-modal').click(function save(){
        if(!current_card_editing){
            alert('Unknown card being edited');
            return;
        }
        var front = $('[name="front"]').val();
        var back = $('[name="back"]').val();
        var card_updates = {
            _id: current_card_editing,
            front : $('[name="front"]').val(),
            back : $('[name="back"]').val()
        }
        $.post(deck.link+'/actions/edit-card/'+current_card_editing, card_updates);
        setClientCardValues(card_updates);
    })

    $('.cancel-edit-card-modal').click(function(){
        console.log('click')
        var front = $('[name="front"]').val();
        var back = $('[name="back"]').val();
        clearAndHideModal();
    })
    function clearAndHideModal(){
        $('#edit-card-modal').hide();
        $('#edit-card-modal textarea').val('');
        $('#edit-card-modal .trumbowyg-editor').text('')
    }


})