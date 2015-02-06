var Map = {

	init: function(opts)
	{
		this.setup(opts);

		this.setCenterMap();
	},

	setup: function(opts)
	{
		var self = this;

		self.defaultOpts = {
			id: 'map',
			startZoom: 1,
			startPoint: { lon: -5875255.7412941, lat: -1059111.4637721 }
		};

		OpenLayers.Util.applyDefaults(opts, self.defaultOpts);

		self._map = new OpenLayers.Map(opts.id, {
			theme: null,
			projection: 'EPSG:4326'
		});
		self._startZoom = opts.startZoom;
		self._startPoint = new OpenLayers.LonLat(opts.startPoint.lon, opts.startPoint.lat);

		self._layers 		 = [];
		self._baselayers = [];
		self._controls   = [];

		self.setupLayers();
		self.setupControls();
	},

	setBaseLayer: function(index)
	{
		this._map.setBaseLayer(this._map.layers[index]);
	},

	/**
   * setBaseLayers method
   */
  setupLayers: function()
  {
    var self = this;

    self._baselayer = {
			GOOGLE_MAP:    0,
		};

		self._baselayers = [
			new OpenLayers.Layer.Google('Google Mapas', {
				minZoomLevel: 5,
				maxZoomLevel: 19
			})
		];

		self._map.addLayers(self._baselayers);
		for(var key in self._layers)
		{
			self._map.addLayer(self._layers[key]);
		}
  },

  /**
   * setControls method
   */
  setupControls: function()
  {
    var self = this;

    self._controls = {
      zoom: new OpenLayers.Control.Zoom(),
      nav: new OpenLayers.Control.Navigation({
        documentDrag: true,
        dragPanOptions: { enableKinetic: true }
      }),
      selectPoint: new OpenLayers.Control.SelectFeature([self._layers.points], {
      	autoActivate: true,
      	onSelect: self.onSelectPoint
      }),
      mousePosition: new OpenLayers.Control.MousePosition()
    };

    for(var key in this._controls)
    {
      this._map.addControl(this._controls[key]);
    }
  },

  /**
   * setCenterMap method
   * @param {OpenLayers.LonLat} point
   * @param {int} zoom
   */
  setCenterMap: function(point, zoom, opts)
  {
  	var self = this,
  			opts = opts || {},
  			defaultOpts = {
  			};

  	if(point && !point.hasOwnProperty('CLASS_NAME') && point.CLASS_NAME !== 'OpenLayers.LonLat')
  	{
  		point = new OpenLayers.LonLat(point.lon, point.lat);
  	}

  	if(opts.hasOwnProperty('transformTo'))
  	{
  		point = point.transform(new OpenLayers.Projection(opts.transformTo), self._map.getProjection());
  	}

    self._map.setCenter(point || self._startPoint, zoom || self._startZoom);
  },

  /**
	* Retorna a lista de camadas mapa do mapa
	* @return {Array}
	*/
	getBaselayersList: function()
	{
		var self = this,
				arr = [];

		for (var key in self._baselayers)
		{
			arr.push(self._baselayers[key].name);
		};
		return arr;
	},

	/**
	* Desenha um ponto no mapa
	* @param {Object} ponto simplificado
	* @param {Function} callback function
	*/
	addPoints: function(points, opts, callback)
	{
		var self = this,
				opts = opts || {},
				defaultOpts = {
					layer: 'points',
					clearBefore: true,
				},
				arrPontos    = [];

		OpenLayers.Util.applyDefaults(opts, defaultOpts);

		for(var key in points)
		{
			var label = '';
			if(points[key].hasOwnProperty('title'))
			{
				label = points[key].title;
			}

			var pointOpts = {
				label: label,
				icon:  points[key].icon
			};

			var point = new OpenLayers.Geometry.Point(points[key].xy.x, points[key].xy.y);
			var trans = point.transform(new OpenLayers.Projection('EPSG:4326'), self._map.getProjection());

			var feature = new OpenLayers.Feature.Vector(point, pointOpts);
			feature.data = points[key];

			arrPontos.push(feature);
		}

		if(opts.clearBefore)
		{
			self._layers[opts.layer].destroyFeatures();
		}

		self._layers[opts.layer].addFeatures(arrPontos);

		if('function' == typeof(callback))
		{
			callback();
		}
	},

	/**
	* Desenha um ponto no mapa
	* @param {Object} ponto simplificado
	* @param {Object} opcoes
	* @param {Function} callback function
	*/
	addPoint: function(point, opts, callback)
	{
		var self = this;
		self.addPoints([point], opts, callback);
	},

	/**
	* onSelectFeature
	* @private
	*/
	onSelectFeature: function(feature)
	{
		var self = this;
		if(feature.geometry.id.indexOf("Point") > -1)
		{
			self.onSelectPointFeature(feature);
		}
	},

	showPopup: function(opts)
	{
		var self = this,
				popup,
				defaultOpts = {
					type: 'Point'
				};

		OpenLayers.Util.applyDefaults(opts, defaultOpts);

		self.removePopups();

		popup = new OpenLayers.Popup('Popup ' + opts.type,
			new OpenLayers.LonLat(opts.position.x, opts.position.y),
			null,
			opts.content,
			true
		);
		popup.opacity = .9;

		self._map.addPopup(popup);
		popup.fixPadding();
		popup.updateSize();
	},

	/**
	 * removePopups method
	 */
	removePopups: function()
	{
		var self = this;
		for(var key in self._map.popups)
		{
			self._map.removePopup(self._map.popups[key]);
		}
	},

	/**
	* onSelectPointFeature
	* @private
	*/
	onSelectPointFeature: function(feature)
	{
		return feature;
	},

	onSelectPoint: function(callback)
	{
		var self = this;
		if(!callback) return;
		self.onSelectPointFeature = callback;
	},

	getActualZoom: function(callback)
	{
		var self = this;
		self._map.events.register('zoomend', self._map, function(e) {
      var zoom = self._map.getZoom();
      callback(zoom);
    });
	},

  clearLayer: function(layer)
  {
  	if(this._layers.hasOwnProperty(layer))
  	{
  		this._layers[layer].removeFeatures(this._layers[layer].features);
  	}
  },

  locationToXY: function(location)
	{
		location = location.substring(6);
		location = location.slice(0, -1);
		location = location.split(' ');
		location = {
			x: location[0],
			y: location[1]
		}

		return location;
	},

	fixMapHeight: function()
	{
		var self   = this,
				height = window.innerHeight,
				element = self._map.div.id;

		height -=  106;
		element = document.getElementById(element);
		element.style.height = height + 'px';
		self._map.updateSize();
	},
};