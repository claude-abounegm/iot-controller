'use strict';

$(function() {
	$(document).on('click', '#blinds_up', function() {
		$.ajax({
			method: "PUT",
			url: "/blinds",
			data: { action: "up" }
  		});
	});
	
	$(document).on('click', '#blinds_down', function() {
		$.ajax({
			method: "PUT",
			url: "/blinds",
			data: { action: "down" }
  		});
	});
	
	$(document).on('click', '#blinds_stop', function() {
		$.ajax({
			method: "PUT",
			url: "/blinds",
			data: { action: "stop" }
  		});
	});
});