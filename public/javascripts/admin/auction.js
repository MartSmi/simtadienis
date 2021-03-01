function add_alert(template, form, insertions) {
	var alrt = template.clone();
	Object.keys(insertions).forEach(function (key) {
		alrt.find('span.' + key.replace(/_/g, '-')).html(insertions[key]);
	});
	alrt.removeClass('d-none').removeAttr('id').insertAfter(form);
}

$(function () {
	// stop button
	var stop_form = $('#stopForm');
	stop_form.on('submit', function (event) {
		event.preventDefault();

		$.post('/auction-admin/stopCurrent', $(this).serialize(), function (data, status_text, xhr_obj) {
			if (data.success) {
				add_alert($('#stop-success-template'), stop_form, {});
			}
			else {
				if (data.refresh) location.reload(true);
				add_alert($('#stop-failure-template'), stop_form, {
					alrt_error: data.error
				});
			}
		}).fail(function (xhr_obj, status_text, error) {
			add_alert($('#stop-failure-template'), stop_form, {
				alrt_error: 'techninė.'
			});
		});
	});
});

$(function () {
	// add new item button
	var new_item_form = $('#newItemForm');
	new_item_form.on('submit', function (event) {
		event.preventDefault();

		$.post('/auction-admin/newItem', $(this).serialize(), function (data, status_text, xhr_obj) {
			if (data.success) {
				add_alert($('#new-item-success-template'), new_item_form, {});
			}
			else {
				if (data.refresh) location.reload(true);
				add_alert($('#new-item-failure-template'), new_item_form, {
					alrt_error: data.error
				});
			}
		}).fail(function (xhr_obj, status_text, error) {
			add_alert($('#new-item-failure-template'), new_item_form, {
				alrt_error: 'techninė.'
			});
		});
	});
});


var biggestBetText = document.getElementById('biggestBetText');
//console.log(biggestBetText);

function updateBiggestBetFields(){	
	$.get(
		'/auction/get-biggest-bet',
		function(data) {
		   	biggestBet = data.biggest_bet;
		   	bettorName = data.bettor_name;
			biggestBetText.innerHTML = 'Daugiausiai pastatyta: ' + biggestBet + ' licų (' + bettorName + ')';
		}
	).fail(() => {
		console.log("Klaida, techninė.");
	});

    setTimeout(updateBiggestBetFields, 1000);
}

updateBiggestBetFields();