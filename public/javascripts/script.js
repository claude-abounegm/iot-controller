'use strict';

$(function() {
	var blindsUrl = "/api/blinds";
	var hvacUrl = "/api/hvac";
	$(document).on('click', '#blinds_up', function() {
		$.ajax({
			method: "PUT",
			url: blindsUrl,
			data: { action: "up" }
  		});
	});
	
	$(document).on('click', '#blinds_down', function() {
		$.ajax({
			method: "PUT",
			url: blindsUrl,
			data: { action: "down" }
  		});
	});
	
	$(document).on('click', '#blinds_stop', function() {
		$.ajax({
			method: "PUT",
			url: blindsUrl,
			data: { action: "stop" }
  		});
	});
	
	$(document).on('click', '#hvac_cool', function() {
		$.ajax({
			method: "PUT",
			url: hvacUrl,
			data: { action: "cool" }
  		});
	});
	
	$(document).on('click', '#hvac_heat', function() {
		$.ajax({
			method: "PUT",
			url: hvacUrl,
			data: { action: "heat" }
  		});
	});

	$(document).on('click', '#hvac_off', function() {
		$.ajax({
			method: "PUT",
			url: hvacUrl,
			data: { action: "off" }
  		});
	});
});