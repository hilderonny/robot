function sprechen() {
        $.post('/sprechen', { text: $('#speaktextinput').val() });
	$('#speaktextinput').val('');
}

function lauter() {
        $.get('/lauter');
}

function leiser() {
        $.get('/leiser');
}

window.addEventListener('load', function() {
        $('#sprechenbutton').click(sprechen);
	$('#speaktextinput').on('keypress', function (e) {
		if(e.which === 13) sprechen();
	});
        $('#lauterbutton').click(lauter);
        $('#leiserbutton').click(leiser);
});
