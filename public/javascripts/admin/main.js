function add_alert(template, form, insertions) {
	var alrt = template.clone();
	Object.keys(insertions).forEach(function (key) {
		alrt.find('span.' + key.replace(/_/g, '-')).text(insertions[key]);
	});
	alrt.removeClass('d-none').removeAttr('id').insertAfter(form);
}

$(function () {
	var add_user_form = $('#form-add-user');
	add_user_form.on('submit', function (event) {
		event.preventDefault();
		var username = add_user_form.find('#username').val();
		$(this).find('input[type="checkbox"]:not(:checked)').each(function () {
			$(this).prepend(
				$('<input>').attr('type', 'hidden')
				            .attr('name', $(this).attr('name'))
							.attr('value', '0')
			);
		});

		$.post('/admin-action/add-user', $(this).serialize(), function (data, status_text, xhr_obj) {
			if (data.success) {
				add_alert($('#add-user-success-template'), add_user_form, {
					alrt_username: username
				});
			}
			else {
				add_alert($('#add-user-failure-template'), add_user_form, {
					alrt_error_type: 'Error ',
					alrt_username: username,
					alrt_error: data.error
				});
			}
		}).fail(function (xhr_obj, status_text, error) {
			add_alert($('#add-user-failure-template'), add_user_form, {
				alrt_error_type: 'XHR Error ',
				alrt_username: username,
				alrt_error: status_text + ', ' + error
			});
		});

		$(this).find('input[type="hidden"]').remove();
	});
});
