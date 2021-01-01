var xhr_success_callback = function(data, status_text, xhr_obj) {
	if (data.success) alert('Success');
	else alert('Error: ' + data.error);
};

var xhr_failure_callback = function(xhr_obj, status_text, error) {
	alert('XHR error (status_text: "' + status_text + '", error: "' + error + '")');
};

function get_id(that) {
	return that.parents('tr').find('.id').text();
}

$(function() {
	$('.change-password').click(function() {
		var pw = prompt("New password");
		var that = $(this);
		$.post(
			'/admin-action/change-password',
			'id=' + get_id(that) + '&password=' + pw,
			xhr_success_callback
		).fail(xhr_failure_callback);
	});
	$('.destroy-sessions').click(function() {
		var that = $(this);
		$.post(
			'/admin-action/destroy-sessions',
			'id=' + get_id(that),
			xhr_success_callback
		).fail(xhr_failure_callback);
	});
	$('.freeze, .unfreeze').click(function() {
		var that = $(this);
		var fr = that.hasClass('freeze');
		$.post(
			'/admin-action/freeze',
			'id=' + get_id(that) + '&fr=' + fr,
			function(data, status_text, xhr_obj) {
				if (data.success) {
					that.parent().siblings('.frozen').html(fr ? '&#x2713;' : '');
					that.text(fr ? 'Unfreeze' : 'Freeze');
					that.toggleClass('freeze')
						.toggleClass('unfreeze')
						.toggleClass('btn-danger')
						.toggleClass('btn-success');
				}
				else alert('Error: ' + data.error);
			}
		).fail(xhr_failure_callback);
	});
});
