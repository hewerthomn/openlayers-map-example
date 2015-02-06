$(document).ready(function() {

	var app = {

		init: function()
		{
			this.setup();
			this.bindEvents();

			this.checkResources();
			setInterval(this.checkResources, this.interval);
		},

		setup: function()
		{
			var self = this;

			self.interval = 5000; // 1000 = 1 second

			Map.init({
				id: 'map',
				startZoom: 5,
				startPoint: {
					lat: -977658.25551701,
					lon: -7111653.3375207
				},
				onSelectPoint: self.onSelectPoint
			});
		},

		checkResources: function()
		{
			var self = this;

			$.ajax({
				url: '/resources.php',
			}).success(function(data) {

				if(data.length > 0)
				{
					Map.addPoints(data);
				}

			}).error(function(error) {
				console.error(error);
			})
		},

		onSelectPoint: function(point)
		{
			console.log('point', point);
		},

		bindEvents: function()
		{
			var self = this;

			$('#toLatLon').on('click', function()
			{
				var $this = $(this);
				var zoom = parseInt($('#zoom').val(), 10);
				var lon = parseFloat($('#lon').val());
				var lat = parseFloat($('#lat').val());

				Map.setCenterMap({
					'lon': lon, 'lat': lat
				}, zoom);
			});
		}
		
	};

	app.init();

});