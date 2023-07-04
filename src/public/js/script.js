'use strict';

// Toast
const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	showCloseButton: true,
	timer: 3000,
	timerProgressBar: true,
	didOpen: (toast) => {
		toast.addEventListener('mouseenter', Swal.stopTimer)
		toast.addEventListener('mouseleave', Swal.resumeTimer)
	}
});

// Image Preview
function imagePreview(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = (e) => {
			$('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
			$('#imagePreview').hide();
			$('#imagePreview').fadeIn(650);
		};
		reader.readAsDataURL(input.files[0]);
	}
}

// Load More Datapacks
async function loadDatapacks(type) {
	return new Promise((resolve, reject) => {
		$.ajax({
			method: 'GET',
			url: `/api/v1/datapacks/load/${type}`,
			dataType: 'json',
		}).done((result) => {
			$('#datapackList').append(result.htmlCode);
			Toast.fire({
				icon: `${result.status}`,
				title: `${result.message}`,
			});
			resolve(result.lastId);
		}).fail((e) => {
			reject(e)
		});
	});
}

//Preloader
$(window).on('load', () => {
	$('#preloader').fadeOut("slow");
});

const socket = io();

(($) => {

	socket.on('totalOnline', (totalOnline) => {
		$('#totalOnline').text(totalOnline).fadeOut(500).fadeIn(500);
	});

	$(window).on('scroll', function () {
		var scrolling = $(this).scrollTop();
		if (scrolling > 10) {
			$('.navigation').addClass('nav-bg');
		} else {
			$('.navigation').removeClass('nav-bg');
		}
	});

	// tab
	$('.tab-content').find('.tab-pane').each(function (idx, item) {
		var navTabs = $(this).closest('.code-tabs').find('.nav-tabs'),
			title = $(this).attr('title');
		navTabs.append('<li class="nav-item"><a class="nav-link" href="#">' + title + '</a></li>');
	});

	$('.code-tabs ul.nav-tabs').each(function () {
		$(this).find('li:first').addClass('active');
	});

	$('.code-tabs .tab-content').each(function () {
		$(this).find('div:first').addClass('active');
	});

	$('.nav-tabs a').click(function (e) {
		e.preventDefault();
		var tab = $(this).parent(),
			tabIndex = tab.index(),
			tabPanel = $(this).closest('.code-tabs'),
			tabPane = tabPanel.find('.tab-pane').eq(tabIndex);
		tabPanel.find('.active').removeClass('active');
		tab.addClass('active');
		tabPane.addClass('active');
	});

	// Accordions
	$('.collapse').on('shown.bs.collapse', function () {
		$(this).parent().find('.ti-plus').removeClass('ti-plus').addClass('ti-minus');
	}).on('hidden.bs.collapse', function () {
		$(this).parent().find('.ti-minus').removeClass('ti-minus').addClass('ti-plus');
	});

	// copy to clipboard
	$('.copy').click(function () {
		$(this).siblings('.inputlink').select();
		document.execCommand('copy');
	});

	$('.menu-sticky').on('click', function (e) {
		e.preventDefault();
		alert("hi");
	});

	// popup video
	var $videoSrc;
	$('.video-btn').click(function () {
		$videoSrc = $(this).data('src');
	});

	$('#myModal').on('shown.bs.modal', function (e) {
		$('#video').attr('src', $videoSrc + '?autoplay=1&amp;modestbranding=1&amp;showinfo=0');
	});
	$('#myModal').on('hide.bs.modal', function (e) {
		$('#video').attr('src', $videoSrc);
	});


})(jQuery);