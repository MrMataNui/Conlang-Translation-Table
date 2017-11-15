$(function(){

	// code written by MrMataNui
	var punctuation = [ '!', '.', '?', ',', ';', ':', ''', ''' ];
	var punctuate = [];
	var toWho = ['ME','YOU','HIM', 'HER', 'IT', 'US', 'THEM'];
	var punc = '';

	$('#eng_text').focus();
	$('#eng_text').keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13')
			jovTranslate();
	});
	$('#calculate').click(function(){ 
		jovTranslate();
	});
	$('#jov_text').keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13')
			engTranslate();
	});
	$('#EngCalculate').click(function(){ 
		engTranslate();
	});
	function jovTranslate() {

		var user_text = $.trim($('#eng_text').val().toUpperCase());
		var split_text = user_text.split(' ');

		var solutionArray = [];
		var placementArray = [];
		var stringPunc = [];
		var solutionVar = '';
		var Tenses = '';
		var split_letter = [];
		
		// checks if there is a punctuation at the end
		$.each(split_text, function (i, split_val) {
			$.each(punctuation, function (j, punct_val) {
				// checks daitive pronouns
				if (split_val == 'TO') {
					$.each(toWho, function (k, value) {
						if ( split_text[i+1] == toWho[k] ) {
							split_text[i] += ' '+split_text[i+1];
							split_text[i+1] = '';
							return false;
						} else if ( split_text[i+1] == toWho[k] + punct_val ) {
							split_text[i] += ' '+split_text[i+1];
							split_text[i+1] = '';
							return false;
						}
					});
				}
				if (split_text[i].indexOf(punct_val) >= 0) {
					stringPunc[i] = split_val;
					stringPunc[i] = stringPunc[i].split(punct_val);
					punc = punct_val;
					punctuate[i] = punct_val;
					$.each(stringPunc, function (k, value) {
						if (stringPunc[i][k] !== ''){
							split_val = stringPunc[i][k];
							return false;
						}
					});
				}
			});
		});
		// console.log(punctuate);

		function punctu (solutionVar, dict, key, punc2) {
			solutionVar += dict[key];
			solutionVar = $.trim(solutionVar);
			solutionVar += punc2 + ' ';
			return solutionVar;
		}
		// translates each word
		$.each(split_text, function (i, split_val) {
			$.each(dict, function (dict_key, dict_val) {
					var upperKey = dict_key.toUpperCase();
					// checks for punctuation
					if (stringPunc[i]) {
						if ( split_val == (upperKey + punctuate[i]) ) {
							solutionVar = punctu (solutionVar, dict, dict_key, punctuate[i]);
							return false;
						} else if ( split_val ==  ('YOU' + punctuate[i]) ) {
							solutionVar = punctu (solutionVar, dict, 'singYouN', punctuate[i]);
							return false;
						} else if ( split_val ==  ('TO YOU' + punctuate[i]) ) {
							solutionVar = punctu (solutionVar, dict, 'singToYou', punctuate[i]);
							return false;
						} else if ( split_val ==  'COLOR' ) {
							solutionVar = punctu (solutionVar, dict, 'Colour', punctuate[i]);
							return false;
						} else if ( split_val ==  ('TO HIM' + punctuate[i] )
							|| split_val == ('TO HER' + punctuate[i])
							|| split_val == ('TO IT' + punctuate[i]) ) {
							solutionVar = punctu (solutionVar, dict, 'To_him', punctuate[i]);
							return false;
						} else {
							// checks daitive pronouns
							var test;
							$.each(toWho, function (k, value) {
								if ( split_val == 'TO ' + toWho[k] + punctuate[i] ) {
									solutionVar = punctu (solutionVar, dict, 'To_' + toWho[k].toLowerCase(), punctuate[i] );
									test = true;
									return false;
								}
							});
							if (test)
								return false;
						}
						return;
					} else {
						if ( split_val == upperKey ) {
							solutionVar += dict[dict_key] + ' ';
							return false;
						} else if ( split_val == 'YOU' ) {
							solutionVar += dict['singYouN'] + ' ';
							return false;
						} else if ( split_val == 'TO YOU' ) {
							solutionVar += dict['singToYou'] + ' ';
							return false;
						} else if ( split_val == 'COLOR' ) {
							solutionVar += dict['Colour'] + ' ';
							return false;
						} else if ( split_val == 'TO HIM' 
								|| split_val == 'TO HER'
								|| split_val == 'TO IT') {
							solutionVar += dict['To_him'] + ' ';
							return false;
						} else {
							// checks daitive pronouns
							var test;
							$.each(toWho, function (k, value) {
								if ( split_val == 'TO ' + toWho[k] ) {
									solutionVar = punctu (solutionVar, dict, 'To_' + toWho[k].toLowerCase() );
									test = true;
									return false;
								}
							});
							if (test)
								return false;
						}
					}
					// checks for the tense
					switch (split_val) {
						case 'DID':
						case 'HAD':
							Tenses = 'past';
							break;
						case 'DO':
						case 'DOES':
						case 'HOLD':
						case 'HAVE':
							Tenses = 'present';
							break;
						case 'WILL':
							Tenses = 'future';
							break;
					}
					if (split_val + ' ' + split_text[i+1] == 'WILL HAVE') {
						Tenses = 'future';
						return false;
					}
					return;
			});
		});

		var solution = $.trim(solutionVar);
		solutionArray = solution.split(' ');
		
		var set = '';
		// removes the words 'will' and 'do'
		$.each(solutionArray, function (i, val) {
			$.each(dict, function (dict_key, dict_val) {
				if (dict_key == 'Will' && val == dict_val)
					solutionArray.splice(i, 1);
				else if (dict_key == 'Do' && val == dict_val)
					solutionArray.splice(i, 1);
			});
		});
		// adds the parts of speech to placementArray
		$.each(solutionArray, function (i, val) {
			$.each(dict, function (dict_key, dict_val) {
				if ( val.toUpperCase() == dict_val.toUpperCase() + punctuate[i] 
					|| val.toUpperCase() == dict_val.toUpperCase() ) {
					$.each(wordPlacement, function (place_key, place_val) {
						if ( dict_key.toUpperCase() == place_key.toUpperCase() ) {
							placementArray[i] = place_val;
						}
					});
				} else if ( val.toUpperCase() == dict_val.toUpperCase() ) {
					$.each(wordPlacement, function (place_key, place_val) {
						if ( dict_key.toUpperCase() == place_key.toUpperCase() ) {
							placementArray[i] = place_val;
						}
					});
				}
			});
		});
		// checks the parts of speech to see if affixes are neccesary
		$.each(placementArray, function (i, val) {
			if ( val == 'pronounP' && placementArray[i+1] == 'verb' ) {
				switch ( solutionArray[i] ) {
					case 'De':
					case 'Do&zcaron;':
					case 'Dos':
					case 'Du':
						var place = '#FPS';
						break;
					case 'U&scaron;e':
					case 'U&scaron;uy':
					case 'Un&scaron;&euml;':
					case 'U&scaron;o':
						var place = '#SPS';
						break;
					case '&Zcaron;&euml;f':
					case '&Zcaron;&euml;b':
					case '&Zcaron;uf':
					case '&Zcaron;ey':
						var place = '#TPS';
						break;
					case 'Mon':
					case 'M&euml;v':
					case 'Moc':
					case 'Moq':
						var place = '#FPP';
						break;
					case 'Qo':
					case 'Qu&scaron;':
					case 'Qo&scaron;':
					case 'Qu':
						var place = '#SPP';
						break;
					case 'Gu':
					case 'Gub':
					case 'Goc':
					case 'Gam':
						var place = '#TPP';
						break;
				}
				
			}
			$(place).each(function () {
				if ( solutionArray[i+1].slice(-1) == punctuate[i]) {
					solutionArray[i+1] = solutionArray[i+1].slice(0, -1);
					var solPunc = true;
				}
				if ( Tenses == 'past' )
					var num = 'td:nth-child(2)';
				else if ( Tenses == 'future' )
					var num = 'td:nth-child(4)';
				else
					var num = 'td:nth-child(3)';
				var tense = $(this).siblings(num).text();
				tense = $.trim(tense);
				if (tense.indexOf('(') >= 0 ) {
					var parenthesis = tense.indexOf('(');
					var parenthesis2 = tense.indexOf(')');

					// sets valToDel to letters in parenthesis
					var valToDel = tense.slice(parenthesis, parenthesis2+1);
					$.each(vowels, function (vowKey, vowVal) {
						var new_val = vowVal.toLowerCase();
						// checks if letters in parenthesis starts with a vowel
						if ( tense.charAt(parenthesis+1).toUpperCase() == vowVal ) {
							// checks if the word ends with a vowel
							$.each(vowels, function (vowKey2, vowVal2) {
								if ( solutionArray[i+1].slice(-1).toUpperCase() == vowVal2
									|| solutionArray[i+1].slice(-6).toUpperCase() == '&EUML;') {
									// // valToDel = valToDel.replace('(', '');
									// // valToDel = valToDel.replace(')', '');
									tense = tense.replace(valToDel, '');
									// return false;
								} else {
									tense = tense.replace('(', '');
									tense = tense.replace(')', '');
								}
							});
						}
					});
				}
				var tensePunc;
				$.each(solutionArray[i+1], function (sol_key, sol_val) {
					$.each(punctuation, function (punct_key, punct_val) {
						if (sol_val == punct_val)
							tensePunc = solutionArray[i+1].slice(0, -1);
					});
				});
				// adds the affix to the word
				if (tensePunc)
					tense = tense.replace( '-', tensePunc );
				else
					tense = tense.replace( '-', solutionArray[i+1] );

				// capitalises the first letter of the word
				if ( tense.charAt(0) == '&' ) {
					tense = tense.charAt(0)
						+ tense.charAt(1).toUpperCase()
						+ tense.slice(2).toLowerCase();
				} else {
					tense = tense.charAt(0).toUpperCase()
						+ tense.slice(1).toLowerCase();
				}
				if (tensePunc)
					solutionArray[i+1] = tense + solutionArray[i+1].slice(-1);
				else
					solutionArray[i+1] = tense;
				if (solPunc)
					solutionArray[i+1] += punctuate[i];
				solutionArray.splice(i, 1);
				solutionVar = solutionArray.join(' ');
				solution = $.trim(solutionVar);
			});
		});
		solutionArray = solution.split(' ');
		var solutionArray2 = solutionArray;
		var midPunc = '';
		$(solutionArray).each(function (sol_key, sol_val) {
			$(punctuate).each(function (punct_key, punct_val) {
				if (punct_val && sol_key == punct_key) {
					// console.log(punct_key, punct_val);
					midPunc = punct_val;
				}
			});
		});

		// adds the translated text to $('#div')
		$('#div').children('p.translation').html(solution);
		$('#div').children('p.translation').text(function(_, txt) {
			if (midPunc != '' && midPunc >= 0) {
				// console.log( midPunc, txt.indexOf(midPunc) );
				return txt.charAt(0).toUpperCase()
						+ txt.slice( 1, txt.indexOf(midPunc) ).toLowerCase()
						+ txt.slice( txt.indexOf(midPunc) ).toUpperCase()
						+ txt.slice( txt.indexOf(midPunc) + 1 ).toLowerCase();
			} else
				return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
		});

		// adds the user text to $('#div')
		$('#div').find('h3').text(user_text);
		$('#div').find('h3').text(function(_, txt) {
			if (txt.indexOf(' I ') >= 0) {
				var textFind = txt.indexOf(' I ')+1;
				var english = txt.charAt(0).toUpperCase()
						+ txt.slice(1, textFind).toLowerCase()
						+ txt.charAt(textFind).toUpperCase()
						+ txt.slice(textFind + 1).toLowerCase();
				$('#eng_text').val(english);
				return english;

			}
			if (txt.indexOf(' JOVIAN') >= 0 ) {
				var textFind = txt.indexOf(' JOVIAN')+1;
				var english = txt.charAt(0).toUpperCase()
						+ txt.slice(1, textFind).toLowerCase()
						+ txt.charAt(textFind).toUpperCase()
						+ txt.slice(textFind + 1).toLowerCase();
				$('#eng_text').val(english);
				return english;
			// } else if (txt.indexOf(' I') >= 0) {
				// var textFind = txt.indexOf(' I')+1;
				// if (textFind == (txt.indexOf(punctuate[i])-1) || (txt.length-1) ) {
					// if (textFind == (txt.indexOf(punctuate[i])-1) )
						// var textFind2 = txt.indexOf(punctuate[i])-1;
					// else
						// var textFind2 = txt.length-1;
					// var english = txt.charAt(0).toUpperCase();
					// english += txt.slice(1, textFind2).toLowerCase();
					// english += txt.charAt(textFind2).toUpperCase();
					// english += txt.slice(textFind2 + 1).toLowerCase();
					// $('#eng_text').val(english);
					// return english;
				// }
			} else {
				$('#eng_text').val(txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
				return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
			}
		});

		// gets the translation in order to transcribe into IPA
		var divC = $('#div').children('p.translation').html().toUpperCase();
		split_text = divC.split(' ');
		// removes the punctuation from the translated text
		$.each(split_text, function (i, split_val) {
			$.each(punctuation, function (j, punct_val) {
				if (split_val.indexOf(punct_val) >= 0) {
					stringPunc[i] = split_val;
					stringPunc[i] = stringPunc[i].split(punct_val);
					punc = punct_val;
					$.each(stringPunc, function (k, value) {
						if (stringPunc[i][k] != ''){
							split_text[i] = stringPunc[i][k];
							return false;
						}
					});
				}
			});
			split_letter[i] = split_val.split('');
		});
		
		var IPA = '';
		// transcribes the translated text into IPA
		$.each(split_letter, function (i, split_val) {
			$.each(split_val, function (j, split_val2) {
				$.each(letters, function (k, letter_val) {
					if (split_val2 == k) {
						if ( split_val[j-1] + split_val2 == 'ŠZ' )
							IPA += '';
						else if ( split_val[j-1] + split_val2 == 'ŠY' )
							IPA += '';
						else if ( split_val[j-1] + split_val2 == 'NG' )
							IPA += '';
						else if ( split_val2 + split_val[j+1] == 'NG' )
							IPA += '&#331;';
						else
							IPA += letter_val;
					}
				});
				if (split_val2 == 'Ë' )
					IPA += '&#601;';
				else if (split_val2 + split_val[j+1] == 'ŠZ')
					IPA += '&#658;';
				else if (split_val2 == 'Š')
					IPA += '&#643;';
				else if (split_val2 == 'Ž')
					IPA += '&#658;';
			});
			IPA += ' ';
		});
		IPA = $.trim(IPA).split('');
		$.each(IPA, function (i, IPA_val) {
    		$.each(vowels, function (j, vow_val) {
    			if (IPA_val == vow_val && IPA[i-1] == vow_val ) {
    				IPA.splice(i, 1, ':');
    			}
    		});
		});
		IPA = IPA.join('');
		$('#div').children('p.IPA').html( '/' + $.trim(IPA) + '/' );
		
		$('#div').find('p.translation:not(.Martian, .Jovian)').wrapInner('<strong><em></em></strong>');
		$('#div').find('p.IPA').wrapInner('<strong></strong>');
		// console.log(punctuate);
		// console.log(solutionArray);
		// console.log(solutionArray2);
		$('#eng_text').focus();
		var MarSplit = $('#div').children('p.Martian').text().split('');
		$.each(MarSplit, function (i, Mar_val) {
    		$.each(punctuation, function (j, punc_val) {
    			if (Mar_val == ' ' && MarSplit[i-1] == punc_val ) {
					MarSplit.splice(i, 1);
    			}
    		});
		});
		$('#div').children('p.Martian').html( MarSplit.join('') );
	}
	function engTranslate() {
		$.each(split_text, function (i, split_val) {
			$.each(dict, function (dict_key, dict_val) {
					var upperKey = dict_key.toUpperCase();
					// checks for punctuation
					if (stringPunc[i]) {
						if ( split_val == (upperKey + punctuate[i]) ) {
							solutionVar = punctu (solutionVar, dict, dict_key, punctuate[i]);
							return false;
						} else if ( split_val ==  ('YOU' + punctuate[i]) ) {
							solutionVar = punctu (solutionVar, dict, 'singYouN', punctuate[i]);
							return false;
						} else if ( split_val ==  ('TO YOU' + punctuate[i]) ) {
							solutionVar = punctu (solutionVar, dict, 'singToYou', punctuate[i]);
							return false;
						} else if ( split_val ==  'COLOR' ) {
							solutionVar = punctu (solutionVar, dict, 'Colour', punctuate[i]);
							return false;
						} else if ( split_val ==  ('TO HIM' + punctuate[i] )
							|| split_val == ('TO HER' + punctuate[i])
							|| split_val == ('TO IT' + punctuate[i]) ) {
							solutionVar = punctu (solutionVar, dict, 'To_him', punctuate[i]);
							return false;
						} else {
							// checks daitive pronouns
							var test;
							$.each(toWho, function (k, value) {
								if ( split_val == 'TO ' + toWho[k] + punctuate[i] ) {
									solutionVar = punctu (solutionVar, dict, 'To_' + toWho[k].toLowerCase(), punctuate[i] );
									test = true;
									return false;
								}
							});
							if (test)
								return false;
						}
						return;
					} else {
						if ( split_val == upperKey ) {
							solutionVar += dict[dict_key] + ' ';
							return false;
						} else if ( split_val == 'YOU' ) {
							solutionVar += dict['singYouN'] + ' ';
							return false;
						} else if ( split_val == 'TO YOU' ) {
							solutionVar += dict['singToYou'] + ' ';
							return false;
						} else if ( split_val == 'COLOR' ) {
							solutionVar += dict['Colour'] + ' ';
							return false;
						} else if ( split_val == 'TO HIM' 
								|| split_val == 'TO HER'
								|| split_val == 'TO IT') {
							solutionVar += dict['To_him'] + ' ';
							return false;
						} else {
							// checks daitive pronouns
							var test;
							$.each(toWho, function (k, value) {
								if ( split_val == 'TO ' + toWho[k] ) {
									solutionVar = punctu (solutionVar, dict, 'To_' + toWho[k].toLowerCase() );
									test = true;
									return false;
								}
							});
							if (test)
								return false;
						}
					}
					// checks for the tense
					switch (split_val) {
						case 'DID':
						case 'HAD':
							Tenses = 'past';
							break;
						case 'DO':
						case 'DOES':
						case 'HOLD':
						case 'HAVE':
							Tenses = 'present';
							break;
						case 'WILL':
							Tenses = 'future';
							break;
					}
					if (split_val + ' ' + split_text[i+1] == 'WILL HAVE') {
						Tenses = 'future';
						return false;
					}
					return;
			});
		});
	}
	$('.Martian').each( function () {
        if( $(this).css('font-weight') == 'bold' )
            $(this).css('font-weight', 'normal')
    });

});
