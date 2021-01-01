var init = function(){
	$('.revert, .unrevert').click(function() {
		var that = $(this);
		var r = that.hasClass('revert');
		$.post('/admin-action/revert', 'id=' + $(this).attr('data-id') + '&rev=' + r, function(data, status_text, xhr_obj) {
			if (data.success) {
				if (r) {
					that.parents('tr').addClass('reverted');
					that.attr('class', 'btn btn-sm btn-success unrevert');
					that.text('Unrevert');
				}
				else {
					that.parents('tr').removeClass('reverted');
					that.attr('class', 'btn btn-sm btn-danger revert');
					that.text('Revert');
				}

				$('.revert, .unrevert').off('click');
				init();
			}
			else {
				alert('Failure: ' + data.error);
			}
		}).fail(function (xhr_obj, status_text, error) {
			alert('XHR failure (status_text: "' + status_text + '", error: "' + error + '")');
		});
	});
};

$(init);
