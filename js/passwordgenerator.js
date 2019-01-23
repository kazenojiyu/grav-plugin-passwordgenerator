var chars_type = {};
var list_params = $('#passwords_generator_char_types input[type=checkbox]');
var pwd_length = $('#passwords_generator_char_number');
var pwd_number = $('#passwords_generator_number');
var text_field = $('#form-password .text');
var cache_field = $('.strength-wrapper .cache');
var weight = {
	10: 3.32,
	16: 4,
	26: 4.7,
	36: 5.17,
	52: 5.7,
	62: 5.95,
	70: 6.13,
	90: 6.49
};

function init_array_chars_type(){
	chars_type['total'] = 0;
	$.each(list_params, function( key, elmt ){
		chars_type[elmt.id] = elmt.checked?elmt.getAttribute('nb'):0;
		chars_type['total'] += elmt.checked?parseInt(elmt.getAttribute('nb'),10):0;
	});
	strength_calculator();
} // function init_array_chars_type

function string_shuffle(str){
	let randomStr = str.split('').sort(function (a, b) { 
		return Math.random()>.5 ? -1 : 1;
	}); 
	return randomStr.join('');
}// function string_shuffle

function strength_calculator(){
	var len = parseInt(pwd_length.val(),10);
	var total = parseInt(chars_type['total'],10);
	var min = 0;
	var val = 0;

	$.each(weight, function( key, elmt ){
		if(total > min && total <= key){
			val = elmt;
			return false;
		}
		min = key;		
	});

	result = Math.round( len * val );
	percent = 0;
	if(result <= 64){
		percent = 25;
		text_field.html(text_field.attr('very-weak'));
	}else if(result <= 80){
		percent = 50;
		text_field.html(text_field.attr('weak'));
	}else if(result <= 100){
		percent = 75;
		text_field.html(text_field.attr('medium'));
	}else if(result > 100){
		percent = 100;
		text_field.html(text_field.attr('strong'));
	}
	cache_field.css('width',(100-percent)+'%');

} // function strength_calculator

function show_result(list) {
	if(list.length == 0)
		return ;
	
	let result = $('#list');
	result.html("");
	for(let i = 0; i < list.length; i++) {
		let tmp = '<div>'+list[i]+'</div>';
		result.append(tmp);
	}
} // function show_result

$(document).ready(function(){

	init_array_chars_type();

	list_params.on('click', function(){
		chars_type[$(this).attr('id')] = $(this).is(':checked')?parseInt($(this).attr('nb'),10):0;
		chars_type['total'] += $(this).is(':checked')?parseInt($(this).attr('nb'),10):-parseInt($(this).attr('nb'),10);
		strength_calculator();
	}); // on #passwords_generator_char_types click
	$('#passwords_generator_char_number').on('change', function(){
		strength_calculator();		
	});

	$('#form-password').on('submit', function(e){
		e.preventDefault();
		e.stopPropagation();


		let chars = '';
		let passwordList = [];

		$.each(list_params, function( key, elmt ){
			if(true === elmt.checked) {
				switch(elmt.value) {
					case "minuscules":
						chars += 'abcdefghijklmnopqrstuvwxyz';
						break;
					case "majuscules":
						chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
						break;
					case "chiffres":
						chars += '0123456789';
						break;
					case "speciaux":
						chars += ".,;:+=!?&$#%@{}[]()*'";
						break;
				}
			}
		});

		let pwdLen = parseInt(pwd_length.val(), 10);

		for(let i = 0; i < parseInt(pwd_number.val(), 10); i++) {
			passwordList.push(string_shuffle(chars).substr(0,pwdLen));
		}

		show_result(passwordList);
	});


});