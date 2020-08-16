var SKYCIV_UTILS = {};

SKYCIV_UTILS.event = function() {};

SKYCIV_UTILS.getCSRF = function () {
	var $token = jQuery('meta[name="csrf-token"]');
	if ($token.length == 0 || $token == null) return "";
	return $token.attr('content');
};

SKYCIV_UTILS.getDevToken = function () {
	var $token = jQuery('meta[name="dev-token"]');
	if ($token.length == 0 || $token == null) return "";
	return $token.attr('content');
};

SKYCIV_UTILS.alert = function (args) {

	if (typeof args !== 'object') {
		args = {
			'body': args // just body
		};
	}

	function convertDim(dim) {
		if (dim.indexOf("%") < 0 && dim.indexOf("px") < 0 && dim != "auto") {
			dim = dim.trim() + "px";
		}

		return dim;
	}

	/* Args:
	*	body or content	(str of html)
	*	title 		(str of html)
	*	width	
	*	height
	*	buttons		(object which has values as the functions of the buttons - Don't define negative button)
	* 	showClose	(boolean. false = hides close button)
	*	close		(boolean. true = closes when finished)
	*	closeName 	(str. name of close button)
	*/

	// Defaults
	var body = "";
	var title = 'Alert';
	var width = '400';
	var height = 'auto';
	var max_width = null;
	var max_height = null;
	var min_width = '400px';
	var min_height = null;
	var buttons = {};
	//var button_args = {};
	var show_close_button = true;
	var needs_closing = true;
	var negative_button_name = "Close";
	var hideX = false;
	var functionX = null;
	var hideTitleLogo = false;
	var enableEnterKey = true;
	var helpFunction = null;
	var openFunction = null;
	var closeFunction = null;
	var resizable = true;
	var background_color = 'transparent';
	var style = "semantic"; //"jquery";
	var outside_close = true;
	var closable = true;
	//var opacity = 0.65;

	if (args['body'] != null) body = args['body'];
	if (args['content'] != null) body = args['content'];
	if (args['title'] != null) title = args['title'];
	if (args['width'] != null) width = args['width'];
	if (args['height'] != null) height = args['height'];
	if (args['maxWidth'] != null) max_width = args['maxWidth'];
	if (args['maxHeight'] != null) max_height = args['maxHeight'];
	if (args['minWidth'] != null) min_width = args['minWidth'];
	if (args['minHeight'] != null) min_height = args['minHeight'];
	if (args['buttons'] != null) buttons = args['buttons'];
	//if (args['button_args'] != null) button_args = args['button_args'];
	if (args['showClose'] != null) show_close_button = args['showClose'];
	if (args['close'] != null) needs_closing = args['close'];
	if (args['closeName'] != null) negative_button_name = args['closeName'];
	if (args['hideX'] != null) hideX = args['hideX'];
	if (args['functionX'] != null) functionX = args['functionX'];
	if (args['hideTitleLogo'] != null) hideTitleLogo = args['hideTitleLogo'];
	if (args['enableEnterKey'] != null) enableEnterKey = args['enableEnterKey'];
	if (args['helpFunction'] != null) helpFunction = args['helpFunction'];
	if (args['openFunction'] != null) openFunction = args['openFunction'];
	if (args['closeFunction'] != null) closeFunction = args['closeFunction'];
	if (args['resizable'] != null) resizable = args['resizable'];
	if (args['backgroundColor'] != null) background_color = args['backgroundColor'];
	if (args['style'] != null) style = args['style'];
	if (args['outsideClose'] != null) outside_close = args['outsideClose'];
	if (args['closable'] != null) closable = args['closable'];
	//if (args['opacity'] != null) opacity = args['opacity'];

	if (!closable) { // Override ability to close
		outside_close = false;
		hideX = true;
	}

	if (style == "jquery" || style == "jQuery") {

		var nInstances = jQuery(".dialog-general-alert").length;
		var identifier = 'dialog-general-alert-' + nInstances;

		jQuery('body').append('<div class="dialog-general-alert ' + identifier + '" title="" style="display:none"><div></div></div>');

		identifier = "." + identifier;

		var $alertDialog = jQuery(identifier);

		// Initialise it
		$alertDialog.dialog({
			'autoOpen': false,
			'height': 'auto',
			'width': 'auto',
			//'maxWidth': 'auto',
			//'minWidth': 'auto',
			//'maxHeight': 'auto',
			//'minHeight': 'auto',
			'modal': true,
			'resizable': true,
			'buttons': {},
			'position': {
				'my': "center",
				'at': "center",
				'of': window
			}
		});

		var new_buttons = {};

		$alertDialog.parent().find(".custom-dialog-content").remove();

		if (needs_closing) {
			var button_id = 0;
			for (var i in buttons) {
				//eval('button_id_str = ' + button_id);
				new_buttons[button_id] = {
					text: i,
					click: function (event) {
						var i = jQuery(event.target).text(); // use button text to determine which function to run
						var needsClosing = buttons[i](); // returns true or false

						if (needsClosing == undefined || needsClosing) { // if returns nothing or true then close
							$alertDialog.dialog("close");
						}
					}
				}
				button_id++;
			}
		} else {
			new_buttons = buttons;
		}

		// Add the negative button
		if (show_close_button) {
			new_buttons[negative_button_name] = function () {
				$alertDialog.dialog("close");
			}
		}

		if (!hideTitleLogo) {
			title = '<img style="vertical-align:top; height:30px; margin-right:10px" src="/storage/images/logos/light/square-1.png">' + title;
		}

		if (height != 'auto' && isNaN(height) && height.indexOf('%') > -1) {
			var height_perc = height.split('%')[0];
			height = jQuery('body').outerHeight() * height_perc / 100;
			height = height.toFixed(2);
		}

		jQuery(identifier + " > div").html(body);
		jQuery(identifier).parent().find('.ui-dialog-title').html(title);
		//$alertDialog.dialog('option', 'title', title); // can't handle HTML (text only)

		if (width != "auto") $alertDialog.dialog('option', 'width', width);
		if (height != "auto") $alertDialog.dialog('option', 'height', height);
		$alertDialog.dialog('option', 'resizable', resizable);

		//if (width != "auto") $alertDialog.parent().css('width', width);
		//if (height != "auto") $alertDialog.parent().css('height', height);

		if (min_width != null) {
			//$alertDialog.dialog('option', 'minWidth', min_width);
			$alertDialog.parent().css('min-width', min_width);
		} else {
			$alertDialog.parent().css('min-width', 'none');
		}

		if (max_width != null) {
			//$alertDialog.dialog('option', 'maxWidth', max_width);
			$alertDialog.parent().css('max-width', max_width);
		} else {
			$alertDialog.parent().css('max-width', 'none');
		}

		if (min_height != null) {
			//$alertDialog.dialog('option', 'minHeight', min_height);
			$alertDialog.parent().css('min-height', min_height);
		} else {
			$alertDialog.parent().css('min-height', 'none');
		}

		if (max_height != null) {
			//$alertDialog.dialog('option', 'maxHeight', max_height);
			$alertDialog.parent().css('max-height', max_height);
		} else {
			$alertDialog.parent().css('max-height', 'none');
		}
		$alertDialog.dialog('option', 'buttons', new_buttons);
		//$alertDialog.dialog('option', 'button_args', button_args);

		if (enableEnterKey) { // TODO enterKey + openFunction in combination doesn't work
			$alertDialog.dialog('option', 'open', function () { // Enter key
				jQuery(this).unbind("keypress").keypress(function (e) {
					if (e.keyCode == jQuery.ui.keyCode.ENTER) {
						jQuery(this).parent().find("button:eq(1)").trigger("click");
					}
				});
			});
		}

		if (openFunction) {
			$alertDialog.dialog('option', 'open', openFunction);
		} else {
			$alertDialog.dialog('option', 'open', function () { }); // do nothing to cancel out previous open function
		}

		if (closeFunction) {
			$alertDialog.dialog('option', 'close', function () {
				closeFunction();
				$alertDialog.dialog('destroy').remove(); // fully remove dialog
			});
		} else {
			$alertDialog.dialog('option', 'close', function () {
				$alertDialog.dialog('destroy').remove(); // fully remove dialog
			});
		}

		$alertDialog.dialog("open");

		if (hideX && functionX == null) {
			$alertDialog.parent().find(".ui-dialog-titlebar-close").hide();
		}

		if (functionX) {
			$alertDialog.parent().find(".ui-dialog-titlebar-close").click(function () {
				functionX();
			});
		}

		if (helpFunction) {
			$alertDialog.parent().find('.ui-dialog-titlebar').append('<i class="fa fa-question-circle dialog-helper-icon"></i>');

			var icon = $alertDialog.parent().find('.dialog-helper-icon');

			icon.click(function () {
				helpFunction();
			});

			icon.css('position', 'absolute');
			icon.css('top', '3px');
			icon.css('right', '25px');
			icon.css('padding', '8px');
			icon.css('cursor', 'pointer');
			icon.css('color', '#444');
			icon.hover(function () {
				jQuery(this).css('color', '#289DCC');
			}, function () {
				jQuery(this).css('color', '#444');
			});
		} else {
			$alertDialog.parent().find('.dialog-helper-icon').remove();
		}

		$alertDialog.css('background-color', background_color);

		$alertDialog.updatePosition = function () {
			$alertDialog.dialog('option', 'position', {
				'my': "center",
				'at': "center",
				'of': window
			});
		};

		$alertDialog.close = function () {
			$alertDialog.dialog('close');
			$alertDialog.remove();
		};

		$alertDialog.updatePosition(); // update position automatically

		// Re-position div after all images have loaded
		var $images = $alertDialog.find('img');
		var loaded_images_count = 0;
		$images.on('load', function () {
			loaded_images_count++;
			if (loaded_images_count == $images.length) $alertDialog.updatePosition(); // reposition once all images have loaded
		});

		last_dialog = $alertDialog;
	} else {

		var nInstances = jQuery(".modal-general-alert").length;
		var identifier = 'modal-general-alert-' + nInstances;

		var modal_settings = {
			'allowMultiple': true,
			'autofocus': false, // autofocus first field in modal
			'duration': 0, // turn off animation as it sucks
		};

		var modal_content = '';
		modal_content += '<div class="ui long modal modal-general-alert ' + identifier + '">'; // TODO not sure if large should be used or longer
		modal_content += '<i class="close icon"></i>';
		modal_content += '<div class="header"></div>';
		modal_content += '<div class="content"></div>'; // scrolling?
		modal_content += '<div class="actions"></div>';
		modal_content += '</div>';

		jQuery('body').append(modal_content);

		identifier = "." + identifier;

		var $alertDialog = jQuery(identifier);

		if (!hideTitleLogo) {
			title = '<img style="vertical-align:top; height:30px; margin-right:10px" src="/storage/images/logos/light/square-1.png">' + title;
		}

		if (height != 'auto' && isNaN(height) && height.indexOf('%') > -1) {
			var height_perc = height.split('%')[0];
			height = jQuery('body').outerHeight() * height_perc / 100;
			height = height.toFixed(2);
		}

		$alertDialog.find('.header').append(title);
		$alertDialog.find('.content').append(body);

		$alertDialog.css('width', width);
		$alertDialog.css('height', height);

		if (min_width != null) {
			$alertDialog.css('min-width', min_width);
		} else {
			$alertDialog.css('min-width', 'none');
		}

		if (max_width != null) {
			$alertDialog.css('max-width', max_width);
		} else {
			$alertDialog.css('max-width', 'none');
		}

		if (min_height != null) {
			$alertDialog.css('min-height', min_height);
		} else {
			$alertDialog.css('min-height', 'none');
		}

		if (max_height != null) {
			$alertDialog.css('max-height', max_height);
		} else {
			$alertDialog.css('max-height', 'none');
		}

		if (jQuery.isEmptyObject(buttons) && show_close_button == false) {
			$alertDialog.find('.actions').remove();
		}

		for (var button_name in buttons) {
			$alertDialog.find('.actions').append('<div data-button-index="' + button_name + '" class="ui blue button">' + button_name + '</div>');
		}

		$alertDialog.find('.actions .button').click(function () { // ONLY for actionable buttons (not help and close)
			var button_index = jQuery(this).attr('data-button-index');
			var button_result = buttons[button_index](); // run function

			// Close dialog
			if ((button_result == undefined || button_result) && needs_closing) {
				$alertDialog.modal('hide');
			}
		});

		// Add the negative button last
		if (show_close_button) {
			$alertDialog.find('.actions').append('<div class="ui button close-button">' + negative_button_name + '</div>');

			$alertDialog.find('.actions .close-button').click(function () {
				$alertDialog.modal('hide');
				$alertDialog.remove();
			});
		}

		if (openFunction) {
			modal_settings['onShow'] = openFunction; // onVisible is after it has FULLY opened
		}

		if (closeFunction) {
			modal_settings['onHide'] = closeFunction; // onHidden is after it has fully closed
		}

		//modal_settings['duration'] = 150; // this is so chained alerts work a little better since onHidden takes a long time to call when this duration is longer

		modal_settings['onHidden'] = function () {
			$alertDialog.remove(); // fully remove html of dialog - cleanup
		}

		if (hideX && functionX == null) {
			$alertDialog.find('.close').hide();
			$alertDialog.remove();
		}

		if (functionX) {
			$alertDialog.find('.close').click(function () {
				functionX();
			});
		}

		$alertDialog.find('.close').click(function () {
			$alertDialog.modal('hide');
			$alertDialog.remove();
		});

		if (helpFunction) {
			$alertDialog.find('.actions').prepend('<div class="ui left floated green icon button button-help"><i class="help circle icon"></i> Help</div>');

			$alertDialog.find('.actions .button-help').click(function () {
				helpFunction();
			});
		}

		//$alertDialog.css('background-color', background_color);

		modal_settings['closable'] = outside_close; // clicking outside closes it?

		setTimeout(function () {
			$alertDialog.modal(modal_settings).modal('show');
		}, 10);

		// Reposition the dialog to the middle of the screen
		$alertDialog.css('margin', '0px');

		var screen_height = jQuery(window).height();
		var screen_width = jQuery(window).width();

		var top_pos = (screen_height - $alertDialog.outerHeight()) / 2;
		var left_pos = (screen_width - $alertDialog.outerWidth()) / 2;

		$alertDialog.css('top', top_pos);
		$alertDialog.css('left', left_pos);

		$alertDialog.close = function (fast) {
			if (fast) {
				$alertDialog.modal({ duration: 0 }).modal('hide');
				$alertDialog.remove();
			} else {
				$alertDialog.modal('hide');
				$alertDialog.remove();
			}
		};

		// auto-focus first button in dialog
		if (enableEnterKey) {
			$alertDialog.unbind("keypress").keypress(function (e) {
				if (e.keyCode == jQuery.ui.keyCode.ENTER) {
					var $active_field = jQuery(document.activeElement);
					if ($active_field.prop("tagName") == "TEXTAREA") return; // don't submit for textareas

					$alertDialog.find(".actions .button:first").trigger("click");
				}
			});

			$alertDialog.attr('tabindex', 1); // requires a tab index to respond to keypress
			setTimeout(function () {
				$alertDialog.focus();
			}, 150); // must be more than the open timeout
		}

		// Re-position div after all images have loaded
		var $images = $alertDialog.find('.content img');
		var loaded_images_count = 0;
		$images.on('load', function () {
			loaded_images_count++;
			if (loaded_images_count == $images.length) $alertDialog.modal('refresh'); // reposition once all images have loaded
		});
	}

	return $alertDialog;
};

SKYCIV_UTILS.generateToken = function (length) {
	var characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var randomString = '';

	for (var i = 0; i < length; i++) {
		randomString += characters[Math.floor(Math.random() * (characters.length - 1))];
	}

	return randomString;
};

SKYCIV_UTILS.copy = function (obj) {
	var obj_str = null;

	try {
		obj_str = JSON.stringify(obj);
	} catch (e) {

	}

	if (obj_str == null) return null;

	return JSON.parse(obj_str);
};