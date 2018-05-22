$(document).ready(function () {
    var editor_config = {
        autogrow: false,
        imageWidthModalEdit: true,
        btns: [
            ['viewHTML'],
            ['undo', 'redo'], // Only supported in Blink browsers
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['insertImage'],
            ['unorderedList', 'orderedList'],
            ['horizontalRule'],
            ['removeformat']
        ]
    };
    if ((typeof (multiple_cards) === 'undefined') || (!multiple_cards) ){
        $('#card-group-0 textarea').trumbowyg(editor_config);
    } else {
        var count = 0;
        var card_group = $('.card-groups').show().html();
        $('.card-groups').empty();
        function addCardGroup() {
            $('.card-groups').append(card_group.replace('card-group-0', 'card-group-' + count));
            if (count == 0) {
                $('#card-group-0 textarea').prop('required', true);
            }
            $('#card-group-' + count + ' textarea').trumbowyg(editor_config);
            count++;
        }
        addCardGroup();
        $('.card-groups').keyup(function () {
            if ($('textarea:last').val()) {
                addCardGroup();
            }
        })
    }
})