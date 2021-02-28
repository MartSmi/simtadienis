function add_alert(template, form, insertions) {
	var alrt = template.clone();
	Object.keys(insertions).forEach(function (key) {
		alrt.find('span.' + key.replace(/_/g, '-')).html(insertions[key]);
	});
	alrt.removeClass('d-none').removeAttr('id').insertAfter(form);
}

$(function () {
	var bet_form = $('#bet-form');
	bet_form.on('submit', function (event) {
		event.preventDefault();

		$.post('/auction/bet', $(this).serialize(), function (data, status_text, xhr_obj) {
			if (data.success) {
				add_alert($('#transfer-success-template'), bet_form, {
					alrt_amount: data.amount
				});

				// var b = $('#balance');
				// b.text(parseInt(b.text()) - parseInt(data.amount));

				bet_form.get(0).reset();
			}
			else {
				if (data.refresh) location.reload(true);
				add_alert($('#transfer-failure-template'), bet_form, {
					alrt_error: data.error
				});
			}
		}).fail(function (xhr_obj, status_text, error) {
			add_alert($('#transfer-failure-template'), bet_form, {
				alrt_error: 'techninė.'
			});
		});
	});
});
