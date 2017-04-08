'use strict';

$(function() {
	$(document).on('click', '#blinds_up', function() {
		$.ajax({
			method: "PUT",
			url: "/control",
			data: { action: "up" }
  		});
	});
	
	$(document).on('click', '#blinds_down', function() {
		$.ajax({
			method: "PUT",
			url: "/control",
			data: { action: "down" }
  		});
	});
	
	$(document).on('click', '#blinds_stop', function() {
		$.ajax({
			method: "PUT",
			url: "/control",
			data: { action: "stop" }
  		});
	});

	$(document).on('click', '#hvac_fan', function() {
		$.ajax({
			method: "PUT",
			url: "/control",
			data: { action: "fan" }
  		});
	});
	
	$(document).on('click', '#hvac_air', function() {
		$.ajax({
			method: "PUT",
			url: "/control",
			data: { action: "air" }
  		});
	});
	
	$(document).on('click', '#hvac_heat', function() {
		$.ajax({
			method: "PUT",
			url: "/control",
			data: { action: "heat" }
  		});
	});
});