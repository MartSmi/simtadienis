function add_alert(template, form, insertions) {
	var alrt = template.clone();
	Object.keys(insertions).forEach(function (key) {
		alrt.find('span.' + key.replace(/_/g, '-')).html(insertions[key]);
	});
	alrt.removeClass('d-none').removeAttr('id').insertAfter(form);
}

$(function () {
	var stopButton = $('#stopButton');
	stopButton.on('submit', function (event) {
		event.preventDefault();

		$.post('/auction-admin/stopCurrent', $(this).serialize(), function (data, status_text, xhr_obj) {
			if (data.success) {
				add_alert($('#stop-success-template'), transfer_form, {});
			}
			else {
				if (data.refresh) location.reload(true);
				add_alert($('#stop-failure-template'), transfer_form, {
					alrt_error: data.error
				});
			}
		}).fail(function (xhr_obj, status_text, error) {
			add_alert($('#stop-failure-template'), transfer_form, {
				alrt_error: 'techninė.'
			});
		});
	});
});
