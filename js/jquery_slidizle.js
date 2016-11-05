/**
 * Slider jQuery Plugin
 *
 * This plugin allow to create sliders from images, video or html content.
 *
 * @author	Olivier Bossel (andes)
 * @created	21.02.2012
 * @updated 13.01.2016
 * @version	1.3.23
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	/**
	 * Plugin :
	 */
	function Slidizle(item, options) {
		
		// vars :
		this.settings = {

			/**
			 * Some classes applied on different elements
			 */
			classes : {
				
				// class applied on content wrrapper
				content 				: 'slidizle-content', 	

				// class applied on next navigation element		
				next 					: 'slidizle-next',			
				
				// class applied on previous navigation element
				previous 				: 'slidizle-previous',			
				
				// class applied on all slides that are before the active one
				beforeActive 			: 'before-active',

				// class applied on all slides that are after the active one
				afterActive 			: 'after-active',

				// class applied on the next active slide
				nextActive 				: 'next',

				// class applied on the previous active slide
				previousActive 			: 'previous',

				// class applied on container when the slider is in forward mode
				forward 				: 'forward',

				// class applied on container when the slider is in backward mode
				backward 				: 'backward',			

				// class applied on navigation element
				navigation 				: 'slidizle-navigation',			
				
				// class applied on timer element
				timer 					: 'slidizle-timer', // not documented		
				
				// class applied on each slide
				slide 					: 'slidizle-slide',			
				
				// class applied on the next and previous navigation, or the all slider when disabled
				disabled 				: 'disabled',				
				
				// the class applied on container when the slider is at his first slide
				first 					: 'first',

				// the class applied on container when the slider is at his last slide
				last 					: 'last',

				// the play class applied on the container
				play 					: 'played',				
				
				// the pause class applied on the container
				pause 		 			: 'paused',				
				
				// the stop class applied on the container
				stop 					: 'stoped',				
				
				// an class to access the slider
				slider 					: 'slidizle',				
				
				// the className to add to active navigation, slides, etc...
				active 					: 'active',				
				
				// the className to add to the slider and slides when it is in loading mode
				loading 				: 'loading'				
			},					

			// the slider interval time between each medias
			timeout					: null,
			
			// set if the slider has to make pause on mouse hover
			pauseOnHover				: false,						
			
			// set if the slider has to go next on mouse click
			nextOnClick 				: false,						
			
			// set if the slider has to go first item when next on last
			loop 					: false,						
			
			// set if the slider has to play directly or not if a timeout is specified
			autoPlay				: true,						
			
			// activate or not the keyboard
			keyboardEnabled  			: true,						
			
			// activate or not the touch navigation for mobile (swipe)
			touchEnabled 				: true, 										
			
			// specify if need to load the next content before the transition
			loadBeforeTransition 			: true, 						
			
			// specify if the slider is disabled or not (can be a function that return true or false)
			disabled 				: false,

			// callback when the slider is inited
			onInit					: null,						
			
			// callback when a slide is clicked
			onClick					: null,						
			
			// callback before the slider change from one media to another
			beforeChange 				: null,

			// callback when the slider change from one media to another
			onChange				: null,						
			
			// callback after the slider change from one media to another
			afterChange  				: null,

			// callback before the slider begin to load the slide
			beforeLoading 				: null,

			// callback during the loading progress
			onLoading 				: null,

			// callback after the slider has loaded the next slide (before the actual change)
			afterLoading 				: null,

			// callback when the slider change for the next slide
			onNext					: null,						
			
			// callback when the slider change for the previous slide
			onPrevious				: null,						
			
			// callback when the slider change his state to play
			onPlay					: null,						
			
			// callback when the slider change his state to pause
			onPause				: null,						
			
			// callback when the slider resume after a pause
			onResume 				: null		
		};
		this.$refs = {
			slider					: null,						// save the reference to the slider container itself
			content					: null,						// save the reference to the content element
			medias					: null,						// save the references to all medias element
			nextSlide 				: null,						// save the reference to the next media element
			previousSlide 			: null,						// save the reference to the previous media element
			currentSlide 			: null,						// save the reference to the current media element
			beforeActiveSlides 		: null,
			afterActiveSlides 		: null,
			navigation				: null,						// save the reference to the navigation element
			next					: null,						// save the reference to the next button element
			previous				: null,						// save the reference to the previous button element
			current					: null,						// save the reference to the current media displayed
			timer 					: null						// save the reference to the timer element if exist
		};
		this.loadingProgress = 0; 									// store the loading progress of the next slide
		this.current_timeout_time = 0;									// save the current time of the timeout
		this._internalTimer = null;									// save the internal timer used to calculate the remaining timeout etc...
		this.timeout = null;										// save the timeout for playing slider
		this.previous_index = 0;									// save the index of the previous media displayed
		this.current_index = 0;										// save the index of the current media displayed
		this.next_index = 0; 										// save the index of the next media
		this._previous_active_index = 0; 								// save the index of the previous activate media
		this._isPlaying = false;										// save the playing state
		this._isPause = false;										// save the pause status
		this._isOver = false;										// save the over state
		this.total = 0;											// save the total number of element in the slider				
		this.$this = $(item);										// save the jQuery item to access it
		this.clickEvent = navigator.userAgent.match(/mobile/gi) ? 'touchend' : 'click'; 		// the best click event depending on device

		// init :
		this.init($(item), options); 
		
	}
	
	/**
	 * Init : init the plugin
	 *
	 * @param	jQuery	item	The jQuery item
	 * @param	object	options	The options
	 */
	Slidizle.prototype.init = function(item, options) {
		
		// vars :
		var _this = this,
			$this = item;
		
		// add bb-slider class if needed :
		if (!$this.hasClass(_this.settings.classes.slider)) $this.addClass(_this.settings.classes.slider);

		// update options :
		_this._extendSettings(options);

		// save all references :
		_this.$refs.slider = $this;
		_this.$refs.content = $this.find('[data-slidizle-content]').filter(function() {
			return $(this).closest('[data-slidizle]').get(0) == _this.$this.get(0);
		});
		_this.$refs.navigation = $this.find('[data-slidizle-navigation]').filter(function() {
			return $(this).closest('[data-slidizle]').get(0) == _this.$this.get(0);
		});;
		_this.$refs.previous = $this.find('[data-slidizle-previous]').filter(function() {
			return $(this).closest('[data-slidizle]').get(0) == _this.$this.get(0);
		});;
		_this.$refs.next = $this.find('[data-slidizle-next]').filter(function() {
			return $(this).closest('[data-slidizle]').get(0) == _this.$this.get(0);
		});;
		_this.$refs.timer = $this.find('[data-slidizle-timer]').filter(function() {
			return $(this).closest('[data-slidizle]').get(0) == _this.$this.get(0);
		});;

		// apply class :
		if (_this.$refs.content) _this.$refs.content.addClass(_this.settings.classes.content);
		if (_this.$refs.next) _this.$refs.next.addClass(_this.settings.classes.next);
		if (_this.$refs.previous) _this.$refs.previous.addClass(_this.settings.classes.previous);
		if (_this.$refs.navigation) _this.$refs.navigation.addClass(_this.settings.classes.navigation);
		if (_this.$refs.timer) _this.$refs.timer.addClass(_this.settings.classes.timer);

		// get all medias in the slider :
		var $content_childs = _this.$refs.content.children(':first-child');
		if ($content_childs.length > 0) {
			var content_childs_type = $content_childs[0]['nodeName'].toLowerCase();
			_this.$refs.medias = _this.$refs.content.children(content_childs_type);
		}
		
		// apply class :
		$this.addClass(_this.settings.classes.slider);
		_this.$refs.medias.filter(':first-child').addClass(_this.settings.classes.first);
		_this.$refs.medias.filter(':last-child').addClass(_this.settings.classes.last);


		// check if are some medias :
		if (_this.$refs.medias) {

			// add class on medias :
			_this.$refs.medias.addClass(_this.settings.classes.slide);

			// adding click on slides :
			_this.$refs.medias.bind(_this.clickEvent, function(e) {
				// trigger an event :
				$this.trigger('slidizle.click',[_this]);
				// callback :
				if (_this.settings.onClick) _this.settings.onClick(_this);
			});
			
			// creating data :
			_this.total = _this.$refs.medias.length;
			_this.current_index = 0;
		
			// init navigation :
			if (_this.$refs.navigation.length>=1) _this._initNavigation();
			_this.initPreviousNextNavigation();
		
			// check if a content is already active :
			var $active_slide = _this.$refs.medias.filter('.active:first');
			if ($active_slide.length >= 1) {
				// go to specific slide :
				_this.current_index = $active_slide.index();
			}
				
			// update slides refs :
			_this._updateSlidesRefs();

			// check if pauseOnHover is set to true :
			if (_this.settings.pauseOnHover) {
				// add hover listener :
				$this.hover(function(e) {
					// update _isOver state :
					_this._isOver = true;
					// pause :
					_this.pause();
				}, function(e) {
					// update _isOver state :
					_this._isOver = false;
					// resume :
					_this.resume();
				});
			}

			// keyboard navigation :
			if (_this.settings.keyboardEnabled && _this.settings.keyboardEnabled != 'false') _this._initKeyboardNavigation();

			// touch navigation :
			if (_this.settings.touchEnabled && navigator.userAgent.match(/mobile/gi)) _this._initTouchNavigation();

			// play :
			if (_this.settings.autoPlay && _this.$refs.medias.length > 1) _this.play();

			// check if next on click :
			if (_this.settings.nextOnClick)
			{
				_this.$refs.content.bind('click', function() {
					_this.next();
				});
			}

			// check the on init :
			if (_this.settings.onInit) _this.settings.onInit(_this);
			$this.trigger('slidizle.init', [_this]);

			// add forward class :
			_this.$this.addClass(_this.settings.classes.forward);

			// change medias for the first time :
			_this._changeMedias();

		} else {

			// check the on init :
			if (_this.settings.onInit) _this.settings.onInit(_this);
			$this.trigger('slidizle.init', [_this]);

		}
		
	}
	
	/**
	 * Creation of the navigation :
	 */
	Slidizle.prototype._initNavigation = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// check if is an navigation tag :
		if (!_this.$refs.navigation) return false;

		// check if we need to hide navigation if only 1 element
		if (_this.total <= 1) _this.$refs.navigation.hide();

		// check if we have to popule the navigation :
		if (_this.$refs.navigation.children().length <= 0)
		{
			// determine how to populate the navigation :
			var navigation_type = _this.$refs.navigation[0]['nodeName'].toLowerCase(),
				navigation_children_type = (navigation_type == 'dl') ? 'dt' :
											(navigation_type == 'ol') ? 'li' :
											(navigation_type == 'ul') ? 'li' :
											'div';
			
			// create an navigation element for each media :
			for (var i=0; i<_this.total; i++)
			{
				// create an navigation element :
				_this.$refs.navigation.append('<'+navigation_children_type+'>'+(i+1)+'</'+navigation_children_type+'>');	
			}
		}
		
		// add click event on navigation :
		_this.$refs.navigation.children().bind(_this.clickEvent, function(e) {
			
			// vars :
			var $nav = $(this),
				slide_id = $nav.attr('data-slidizle-slide-id'),
				content_by_slide_id = _this.$refs.medias.filter('[data-slidizle-slide-id="'+slide_id+'"]');

			// saving previous var :
			_this.previous_index = _this.current_index;

			// check if nav has an slide id :
			if (slide_id && content_by_slide_id)
			{
				// get index :
				var idx = content_by_slide_id.index();

				// check if index is not the same as now :
				if (idx != _this.current_index)
				{
					// updating current index :
					_this.current_index = idx;

					// change media :
					_this._changeMedias();
				}
			} else {
				// check if is not the same :
				if ($(this).index() != _this.current_index)
				{
					// updating current var :
					_this.current_index = $(this).index();
					
					// change media :
					_this._changeMedias();
				}
			}
			
			// prevent default behaviors :
			e.preventDefault();
		});
	}

	/**
	 * Init keyboard navigation :
	 */
	Slidizle.prototype._initKeyboardNavigation = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// listen for keyboard events :
		$(document).bind('keyup', function(e) {

			// check the pressed key :
			switch (e.keyCode)
			{
				case 39:
					_this.next();
				break;
				case 37:
					_this.previous();
				break;
			}

		});
	}

	/**
	 * Init touch navigation :
	 */
	Slidizle.prototype._initTouchNavigation = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this,
			xStart, yStart;

		// listen for needed events :
		$(document).bind('touchstart', function(e) {
			xStart = e.originalEvent.touches[0].clientX;
			yStart = e.originalEvent.touches[0].clientY;
		});
		$(document).bind('touchmove', function(e) {
			if ( ! xStart || ! yStart) return;
			var x = e.originalEvent.touches[0].clientX,
				y = e.originalEvent.touches[0].clientY,
				xDiff = xStart - x,
				yDiff = yStart - y;

			// check direction :
			if (Math.abs(xDiff) > Math.abs(yDiff))
			{
				if (xDiff > 0)
				{
					_this.next();
				} else {
					_this.previous();
				}
			}

			// reset values :
			xStart = yStart = null;
		});
	}

	/**
	 * Init next and prev links :
	 */
	Slidizle.prototype.initPreviousNextNavigation = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;
		
		// add click event on previous tag :
		if (_this.$refs.previous)
		{	
			// add click handler :
			if (_this.total > 1) _this.$refs.previous.bind(_this.clickEvent, function() { _this.previous(); });
			// hide if no multiple medias :
			if (_this.total <= 1) _this.$refs.previous.hide();
		}
		
		// add click event on next tag :
		if (_this.$refs.next)
		{
			// add click handler :
			if (_this.total > 1) _this.$refs.next.bind(_this.clickEvent, function() { _this.next(); });
			// hide if no multiple medias :
			if (_this.total <= 1) _this.$refs.next.hide();
		}
	}

	/**
	 * Pause the timer :
	 */
	Slidizle.prototype._pauseTimer = function() {

		// vars :
		var _this = this;

		// stop the timer :
		clearInterval(_this._internalTimer);
	};

	/**
	 * Stop the timer :
	 */
	Slidizle.prototype._stopTimer = function() {

		// vars :
		var _this = this;

		// stop the timer :
		clearInterval(_this._internalTimer);

		// reset timer :
		_this._resetTimer();
	};

	/**
	 * Reset timer values :
	 */
	Slidizle.prototype._resetTimer = function() {

		// vars :
		var _this = this;

		// reset values :
		_this.current_timeout_time = _this.$refs.currentSlide.data('slidizle-timeout') || _this.settings.timeout;
		_this.total_timeout_time = _this.$refs.currentSlide.data('slidizle-timeout') || _this.settings.timeout;

	};

	/**
	 * Start the timer :
	 */
	Slidizle.prototype._startTimer = function() {

		// vars :
		var _this = this,
			$this = _this.$this;

		// init the internal timer :
		clearInterval(_this._internalTimer);
		_this._internalTimer = setInterval(function() {
			
			// update current timeout :
			_this.current_timeout_time -= 10;

			// check current timeout time :
			if (_this.current_timeout_time <= 0) {
				// change media :
				_this.next();
			}

		},10);

	};
			
	/**
	 * Managing the media change :
	 */
	Slidizle.prototype._changeMedias = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this,
			disabledClass = _this.settings.classes.disabled;

		// update slides references :
		_this._updateSlidesRefs();

		// before change callback :
		if (_this.settings.beforeChange) _this.settings.beforeChange(_this);
		$this.trigger('slidizle.beforeChange', [_this]);

		// clear timer (relaunched on transition) :
		_this._stopTimer();

		// manage disabled class on navigation :
		if (_this.$refs.next)
		{
			if (_this.isLast() && ! _this.isLoop())
			{
				_this.$refs.next.addClass(disabledClass);
			} else {
				if (_this.$refs.next.hasClass(disabledClass)) _this.$refs.next.removeClass(disabledClass);
			}
		}
		if (_this.$refs.previous)
		{
			if (_this.$refs.previous && _this.isFirst() && ! _this.isLoop())
			{
				_this.$refs.previous.addClass(disabledClass);
			} else {
				if (_this.$refs.previous.hasClass(disabledClass)) _this.$refs.previous.removeClass(disabledClass);
			}
		}

		// manage navigation classes :
		var current_slide_id = _this.$refs.currentSlide.attr('data-slidizle-slide-id');
		_this.$refs.navigation.each(function() {
			var $nav = $(this),
				current_navigation_by_slide_id = $(this).children('[data-slidizle-slide-id="'+current_slide_id+'"]');

			if (current_slide_id && current_navigation_by_slide_id)
			{
				$nav.children().removeClass(_this.settings.classes.active);
				current_navigation_by_slide_id.addClass(_this.settings.classes.active);
			} else {
				$nav.children().removeClass(_this.settings.classes.active);
				$nav.children(':eq('+_this.current_index+')').addClass(_this.settings.classes.active);
			}

		});

		// add the loading class to the slider :
		_this.$refs.slider.addClass(_this.settings.classes.loading);

		// add load class on current element :
		_this.$refs.currentSlide.addClass(_this.settings.classes.loading);

		// launch transition :
		if ( ! _this.settings.loadBeforeTransition || _this.settings.loadBeforeTransition == 'false') 
		{
			// launch transition directly :
			launchTransition();
		} else {
			// before loading callback :
			if (_this.settings.beforeLoading) _this.settings.beforeLoading(_this);
			$this.trigger('slidizle.beforeLoading', [_this]);

			// load content of slide :
			_this._loadSlide(_this.$refs.currentSlide, function($slide) {

				// remove loading class
				$slide.removeClass(_this.settings.classes.loading);

				// remove loading class :
				_this.$refs.slider.removeClass(_this.settings.classes.loading);

				// after loading callback :
				if (_this.settings.afterLoading) _this.settings.afterLoading(_this);
				$this.trigger('slidizle.afterLoading', [_this]);

				// launch transition if has to be launched after loading :
				launchTransition();
			});
		}

		// launch transition and dispatch en change event :
		function launchTransition()
		{
			// remove the class of the current media on the container :
			if (_this.$refs.previousActiveSlide) _this.$this.removeClass('slide-'+_this.$refs.previousActiveSlide.index());

			// set the class of the current media on the container :
			_this.$this.addClass('slide-'+_this.$refs.currentSlide.index());

			// manage first and last class :
			if (_this.isLast()) _this.$this.addClass(_this.settings.classes.last);
			else _this.$this.removeClass(_this.settings.classes.last);
			if (_this.isFirst()) _this.$this.addClass(_this.settings.classes.first);
			else _this.$this.removeClass(_this.settings.classes.first);

			// remove the class of the current media on the container :
			if (_this.$refs.previousActiveSlide) _this.$this.removeClass('loaded-slide-'+_this.$refs.previousActiveSlide.index());

			// set the class of the current media on the container :
			_this.$this.addClass('loaded-slide-'+_this.$refs.currentSlide.index());

			// delete active_class before change :
			_this.$refs.medias.removeClass(_this.settings.classes.active);

			// add active_class before change :
			_this.$refs.currentSlide.addClass(_this.settings.classes.active);
			
			// remove the before active and after active class
			_this.$refs.medias
			.removeClass(_this.settings.classes.beforeActive)
			.removeClass(_this.settings.classes.afterActive);

			// add the before active class
			_this.getBeforeActiveSlides().addClass(_this.settings.classes.beforeActive);
			_this.getAfterActiveSlides().addClass(_this.settings.classes.afterActive);

			// remove the previous and next class
			_this.$refs.medias
			.removeClass(_this.settings.classes.previousActive)
			.removeClass(_this.settings.classes.nextActive);

			// add the previous and next class
			_this.getPreviousSlide().addClass(_this.settings.classes.previousActive);
			_this.getNextSlide().addClass(_this.settings.classes.nextActive);

			// callback :
			if (_this.settings.onChange) _this.settings.onChange(_this);
			$this.trigger('slidizle.change', [_this]);

			// manage onNext onPrevious events :
			if (_this.$refs.currentSlide.index() == 0 && _this.$refs.previousSlide)
			{
				if (_this.$refs.previousSlide.index() == _this.$refs.medias.length-1) {
					if (_this.settings.onNext) _this.settings.onNext(_this);
					$this.trigger('slidizle.next', [_this]);
				} else {
					if (_this.settings.onPrevious) _this.settings.onPrevious(_this);
					$this.trigger('slidizle.previous', [_this]);
				}
			} else if (_this.$refs.currentSlide.index() == _this.$refs.medias.length-1 && _this.$refs.previousSlide)
			{
				if (_this.$refs.previousSlide.index() == 0) {
					if (_this.settings.onPrevious) _this.settings.onPrevious(_this);
					$this.trigger('slidizle.previous', [_this]);
				} else {
					if (_this.settings.onNext) _this.settings.onNext(_this);
					$this.trigger('slidizle.next', [_this]);
				}
			} else if (_this.$refs.previousSlide) {
				if (_this.$refs.currentSlide.index() > _this.$refs.previousSlide.index()) {
					if (_this.settings.onNext) _this.settings.onNext(_this);
					$this.trigger('slidizle.next', [_this]);
				} else {
					if (_this.settings.onPrevious) _this.settings.onPrevious(_this);
					$this.trigger('slidizle.previous', [_this]);
				}
			} else {
				if (_this.settings.onNext) _this.settings.onNext(_this);
				$this.trigger('slidizle.next', [_this]);
			}

			// start timer :
			if (_this.getTotalTimeout()
				&& ! _this._isOver
				&& _this.isPlay()
			) _this._startTimer();

			// after change callback :
			if (_this.settings.afterChange) _this.settings.afterChange(_this);
			$this.trigger('slidizle.afterChange', [_this]);
		}
	}

	/**
	 * Update slides refs :
	 */
	Slidizle.prototype._updateSlidesRefs = function() {

		// vars :
		var _this = this,
			$this = _this.$this;

		// manage indexes :
		var cI = _this.current_index || 0,
			nI = _this.next_index || (_this.current_index+1 < _this.total) ? _this.current_index+1 : 0,
			pI = _this.previous_index || (_this.current_index-1 >= 0) ? _this.current_index-1 : _this.total-1;

		// save the reference to previous activate media :
		if ( _this.$refs.currentSlide) _this.$refs.previousActiveSlide = _this.$refs.currentSlide;

		// save the reference to the previous media displayed :
		_this.$refs.previousSlide = _this.$refs.content.children(':eq('+pI+')');;

		// save the reference to the current media displayed :
		_this.$refs.currentSlide = _this.$refs.content.children(':eq('+cI+')');

		// save the reference to next media :
		_this.$refs.nextSlide = _this.$refs.content.children(':eq('+nI+')');

		// save the before active slides refs :
		_this.$refs.beforeActiveSlides = _this.$refs.medias.filter(':lt('+cI+')');

		// save the after active slides refs :
		_this.$refs.afterActiveSlides = _this.$refs.medias.filter(':gt('+cI+')');

	}

	/**
	 * Load a slide :
	 */
	Slidizle.prototype._loadSlide = function(content, callback) {

		// vars :
		var _this = this,
			$this = _this.$this,
			$content = $(content),
			toLoad = [], loaded = 0;

		// get contents in slide :
		var $items = $content.find('*:not(script)').filter(function() {
			return $(this).closest('[data-slidizle]').get(0) == _this.$this.get(0);
		});

		// add the slide itself :
		$items = $items.add($content);

		// loop on each content :
		$items.each(function() {

			// vars :
			var $item = $(this),
				imgUrl;

			// check if is a custom element to load :
			if (typeof $item.attr('data-slidizle-preload-custom') != 'undefined' && $item.attr('data-slidizle-preload-custom') !== false)
			{
				// add to load array :
				toLoad.push({
					type : 'custom',
					$elm : $item
				});
				return;
			}

			// check if image is in css :
			if ($item.css('background-image').indexOf('none') == -1) {
				var bkg = $item.css('background-image');
				if (bkg.indexOf('url') != -1) {
					var temp = bkg.match(/url\((.*?)\)/);
					imgUrl = temp[1].replace(/\"/g, '');
				}
			} else if ($item.get(0).nodeName.toLowerCase() == 'img' && typeof($item.attr('src')) != 'undefined') {
				imgUrl = $item.attr('src');
			}

			if ( ! imgUrl) return;

			// add image to array :
			toLoad.push({
				type : 'image',
				url : imgUrl
			});

		});

		// check if has nothing to load :
		if ( ! toLoad.length)
		{
			callback($content);
			return;
		}

		// loop on all the elements to load :
		$(toLoad).each(function(index, item) {

			// switch on type :
			switch (item.type) {
				case 'image':
					// create image :
					var imgLoad = new Image();
					$(imgLoad).load(function() {
						// call loaded callback :
						loadedCallback();
					}).error(function() {
						// call loaded :
						loadedCallback();
					}).attr('src', item.url);
				break;
				case 'custom':
					// bind event :
					item.$elm.bind('slidizle.loaded', function(e) {
						// call loaded :
						loadedCallback();
					});
				break;
			}
		});

		// loading progress :
		_this.loadingProgress = 0;

		// loaded callback :
		function loadedCallback() {
			// update number of elements loaded :
			loaded++;

			// calculate progress :
			_this.loadingProgress = 100 / toLoad.length * loaded;

			// onLoading callback :
			if (_this.settings.onLoading) _this.settings.onLoading(_this);
			$this.trigger('slidizle.onLoading', [_this]);

			// check if loading is finished :
			if (loaded >= toLoad.length) callback($content);
		}

	}
			
	/**
	 * Play :
	 */
	Slidizle.prototype.play = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// do nothing if disabled :
		if (_this.isDisabled()) return;

		// protect :
		if (_this._isPlaying || ! _this.getTotalTimeout() || ! _this.$refs.medias.length) return;	

		// remove the pause class :
		_this.$this.removeClass(_this.settings.classes.pause);
		_this.$this.removeClass(_this.settings.classes.stop);

		// add the play class :
		_this.$this.addClass(_this.settings.classes.play);

		// update the pause state :
		_this._isPause = false;
		// update the state :
		_this._isPlaying = true;

		// reset the timeout :
		_this._resetTimer();

		// the timer is started in changemedia
		_this._startTimer();
		
		// trigger callback :
		if (_this.settings.onPlay) _this.settings.onPlay(_this);
		$this.trigger('slidizle.play', [_this]);
	}

	/**
	 * Resume :
	 */
	Slidizle.prototype.resume = function() {

		// vars :
		var _this = this,
			$this = _this.$this;

		// do nothing if disabled :
		if (_this.isDisabled()) return;

		// protect :
		if ( ! _this.isPause()) return;

		// remove the pause class :
		_this.$this.removeClass(_this.settings.classes.pause);
		_this.$this.removeClass(_this.settings.classes.stop);

		// add the play class :
		_this.$this.addClass(_this.settings.classes.play);

		// start timer :
		_this._startTimer();

		// update state :
		_this._isPause = false;
		_this._isPlaying = true;

		// trigger callback :
		if (_this.settings.onResume) _this.settings.onResume(_this);
		$this.trigger('slidizle.resume', [_this]);

	};

	/**
	 * Pause :
	 */
	Slidizle.prototype.pause = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// do nothing if disabled :
		if (_this.isDisabled()) return;

		// protect :
		if ( ! _this.isPlay()) return;

		// remove the play class :
		_this.$this.removeClass(_this.settings.classes.play);
		_this.$this.removeClass(_this.settings.classes.stop);

		// update the pause state :
		_this._isPause = true;
		// update the state :
		_this._isPlaying = false;

		// pause the timer :
		_this._pauseTimer();
		
		// add the pause class :
		_this.$this.addClass(_this.settings.classes.pause);
		
		// trigger callback :
		if (_this.settings.onPause) _this.settings.onPause(_this);
		$this.trigger('slidizle.pause', [_this]);
	}

	/**
	 * Stop :
	 * Stop timer and reset it 
	 */
	Slidizle.prototype.stop = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// do nothing if disabled :
		if (_this.isDisabled()) return;

		// protect :
		if ( ! _this.isPlay()) return;

		// remove the play and pause class :
		_this.$this.removeClass(_this.settings.classes.play);
		_this.$this.removeClass(_this.settings.classes.pause);

		// update the pause state :
		_this._isPause = false;
		// update the state :
		_this._isPlaying = false;
		// stop the timer :
		_this._stopTimer();
		// add the pause class :
		_this.$this.addClass(_this.settings.classes.stop);
		// trigger callback :
		if (_this.settings.onStop) _this.settings.onStop(_this);
		$this.trigger('slidizle.stop', [_this]);
	}

	/**
	 * Toggle play pause :
	 */
	Slidizle.prototype.togglePlayPause = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;

		// do nothing if disabled :
		if (_this.isDisabled()) return;

		// check the status :
		if (_this._isPlaying) _this.pause();
		else _this.play();
	}
	
	/**
	 * Next media :
	 */
	Slidizle.prototype.next = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this,
			disabledClass = _this.settings.classes.disabled;

		// do nothing if disabled :
		if (_this.isDisabled()) return;

		// in on last item :
		if ( ! _this.isLoop() && _this.isLast()) return;

		// manage the backward forward class on container :
		_this.$this.removeClass(_this.settings.classes.backward);
		_this.$this.addClass(_this.settings.classes.forward);

		// save previous active index :
		_this._previous_active_index = _this.current_index;

		// managing current :
		_this.current_index = (_this.current_index+1 < _this.total) ? _this.current_index+1 : 0;
		
		// saving previous :
		_this.previous_index = (_this.current_index-1 >= 0) ? _this.current_index-1 : _this.total-1;

		// managing next :
		_this.next_index = (_this.current_index+1 < _this.total) ? _this.current_index+1 : 0;

		// change medias :
		_this._changeMedias();
	}
			
	/**
	 * Previous media :
	 */
	Slidizle.prototype.previous = function()
	{
		// vars :
		var _this = this,
			$this = _this.$this;
		
		// do nothing if disabled :
		if (_this.isDisabled()) return;

		// check if on last item and the slider if on loop :
		if ( ! _this.isLoop() && _this.isFirst()) return;	

		// manage the backward forward class on container :
		_this.$this.removeClass(_this.settings.classes.forward);
		_this.$this.addClass(_this.settings.classes.backward);

		// save previous active index :
		_this._previous_active_index = _this.current_index;

		// managing current :
		_this.current_index = (_this.current_index-1 < 0) ? _this.total-1 : _this.current_index-1;
		
		// saving previous :
		_this.previous_index = (_this.current_index-1 >= 0) ? _this.current_index-1 : _this.total-1;

		// managing next :
		_this.next_index = (_this.current_index+1 < _this.total) ? _this.current_index+1 : 0;

		// change medias :
		_this._changeMedias();
	}

	/**
	 * Go to a specific slide :
	 *
	 * @param 	String|int 	ref 	The slide reference (can be an index(int) or a string (class or id))
	 */
	Slidizle.prototype.goto = function(ref)
	{
		// vars :
		var _this = this,
			$this = _this.$this,
			$slide = null;

		// do nothing if disabled :
		if (_this.isDisabled()) return;

		// check the ref :
		if (typeof ref == 'string') {
			// check if is an selector specified :
			if (ref.substr(0,1) == '.' || ref.substr(0,1) == '#') {
				// try to find the slide by selector :
				$slide = _this.$refs.content.children(ref);
			} else {
				// check if we can find an slide ref :
				var slideById = _this.$refs.medias.filter('[data-slidizle-slide-id="'+ref+'"]');
				if (slideById.length == 1) {
					$slide = slideById;
				} else if (_this.$refs.medias.filter('#'+ref).length == 1) {
					$slide = _this.$refs.medias.filter('#'+ref);
				}
			}
		} else if (typeof ref == 'number') {
			// get the slide :
			$slide = _this.$refs.medias.filter(':eq('+ref+')');
		}

		// try to get the index of the slide :
		if ($slide && $slide.index() != null) {
			// set the current index :
			_this.current_index = $slide.index();
			// change media :
			_this._changeMedias();
		}
	}

	/**
	 * Go to and play :
	 *
	 * @param 	String|int 	ref 	The slide reference (can be an index(int) or a string (class or id))
	 */
	Slidizle.prototype.gotoAndPlay = function(ref)
	{
		// do nothing if disabled :
		if (this.isDisabled()) return;

		// go to a slide :
		this.gotoSlide(ref);

		// play :
		this.play();
	}

	/**
	 * Go to and stop :
	 *
	 * @param 	String|int 	ref 	The slide reference (can be an index(int) or a string (class or id))
	 */
	Slidizle.prototype.gotoAndStop = function(ref)
	{
		// do nothing if disabled :
		if (this.isDisabled()) return;

		// go to a slide :
		this.gotoSlide(ref);

		// play :
		this.stop();
	}
	
	/**
	 * Get current media :
	 *
	 * @return	jQuery Object	The current media reference
	 */
	Slidizle.prototype.getCurrentSlide = function() {
		return this.$refs.currentSlide;
	}

	/**
	 * Get active slide (alias)
	 */
	Slidizle.prototype.getActiveSlide = Slidizle.prototype.getCurrentSlide;

	/**
	 * Get previous slide :
	 *
	 * @return 	jQuery Object 	The previous media reference
	 */
	Slidizle.prototype.getPreviousSlide = function() {
		return this.$refs.previousSlide;
	}

	/**
	 * Get the next slide :
	 *
	 * @return 	jQuery Object 	The next media reference
	 */
	Slidizle.prototype.getNextSlide = function() {
		return this.$refs.nextSlide;
	}

	/**
	 * Get the before active slides
	 *
	 * @return 	jQuery Object 		All the slides that are before the active one
	 */
	Slidizle.prototype.getBeforeActiveSlides = function() {
		return this.$refs.beforeActiveSlides;
	}

	/**
	 * Get the after active slides
	 *
	 * @return 	jQuery Object 		All the slides that are after the active one
	 */
	Slidizle.prototype.getAfterActiveSlides = function() {
		return this.$refs.afterActiveSlides;	
	}

	/**
	 * Get the previous active slide
	 */
	Slidizle.prototype.getPreviousActiveSlide = function() {
		return this.$refs.previousActiveSlide;
	}
	
	/**
	 * Get all slide :
	 *
	 * @return	jQuery Object	All medias references
	 */
	Slidizle.prototype.getAllSlides = function() {
		return this.$refs.medias;
	}

	/**
	 * Get settings :
	 */
	Slidizle.prototype.getSettings = function() {
		return this.settings;
	}

	/**
	 * Get loading percentage :
	 */
	Slidizle.prototype.getLoadingProgress = function() {
		return this.loadingProgress;
	}

	/**
	 * Get remaining timeout :
	 */
	 Slidizle.prototype.getRemainingTimeout = function() {
		return this.current_timeout_time;
	 };

	/**
	 * Get current timeout
	 */
	Slidizle.prototype.getCurrentTimeout = function() {
		var t = this.$refs.currentSlide.data('slidizle-timeout') || this.settings.timeout;
		if ( ! t) return null;
		return t - this.current_timeout_time;
	};

	/**
	 * Get total timeout
	 */
	Slidizle.prototype.getTotalTimeout = function() {
		return this.total_timeout_time || this.settings.timeout || false;
	};

	/**
	 * Return if is last or not :
	 *
	 * @return 	boolean 	true | false
	 */
	Slidizle.prototype.isLast = function() {
		return (this.getCurrentSlide().index() >= this.getAllSlides().length-1);
	}

	/**
	 * Return if is first or not :
	 *
	 * @return 	boolean 	true | false
	 */
	Slidizle.prototype.isFirst = function() {
		return (this.getCurrentSlide().index() <= 0);
	}

	/**
	 * Is hover :
	 */
	Slidizle.prototype.isHover = function() {
		return this._isOver;
	}

	/**
	 * Is disabled :
	 */
	Slidizle.prototype.isDisabled = function() {
		// check if is disabled :
		var disabled = false;
		if (typeof this.settings.disabled == 'function') disabled = this.settings.disabled();
		else disabled = this.settings.disabled;

		// manage disabled class :
		if (disabled) this.$this.addClass(this.settings.classes.disabled);
		else this.$this.removeClass(this.settings.classes.disabled);

		// return the result :
		return disabled;
	}

	/**
	 * Is loop :
	 */
	Slidizle.prototype.isLoop = function() {
		var loop = this.settings.loop;
		return (loop && loop != 'false');
	};

	/**
	 * Is play :
	 */
	Slidizle.prototype.isPlay = function() {
		return this._isPlaying;
	};

	/**
	 * Is pause :
	 */
	Slidizle.prototype.isPause = function() {
		return this._isPause;
	};

	/**
	 * Is stop :
	 */
	Slidizle.prototype.isStop = function() {
		return ( ! this._isPlaying && ! this._isPause);
	};
	
	/**
	 * Extend settings :
	 */
	Slidizle.prototype._extendSettings = function(options) {

		// vars :
		var _this = this,
			$this = _this.$this;

		// extend with options :
		_this.settings = $.extend(_this.settings, options, true);

		// flatten an object with parent.child.child pattern :
		var flattenObject = function(ob) {
			var toReturn = {};
			for (var i in ob) {
				
				if (!ob.hasOwnProperty(i)) continue;
				if ((typeof ob[i]) == 'object' && ob[i] != null) {
					var flatObject = flattenObject(ob[i]);
					for (var x in flatObject) {
						if (!flatObject.hasOwnProperty(x)) continue;
						toReturn[i + '.' + x] = flatObject[x];
					}
				} else {
					toReturn[i] = ob[i];	
				}
			}
			return toReturn;
		};

		// flatten the settings
		var flatSettings = flattenObject(_this.settings);

		// loop on each settings to get value on the DOM element
		for (var name in flatSettings)
		{
			// split the setting name :
			var inline_setting = 'slidizle-' + name.replace('.','-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
				inline_attr = $this.data(inline_setting);

			// check if element has inline setting :
			if (typeof inline_attr !== 'undefined') {
				// set the setting :
				if (typeof inline_attr == 'number' || typeof inline_attr == 'boolean')
					eval('_this.settings.'+name+' = '+inline_attr);
				else 
					eval('_this.settings.'+name+' = "'+inline_attr+'"');
			}
		}

	};
	 
	/**
	 * jQuery bb_counter controller :
	 */
	$.fn.slidizle = function(method) {

		// check what to do :
		if (Slidizle.prototype[method]) {

			// store args to use later :
			var args = Array.prototype.slice.call(arguments, 1);

			// apply on each elements :
			this.each(function() {
				// get the plugin :
				var plugin = $(this).data('slidizle_api');
				// call the method on api :
				plugin[method].apply(plugin, args);
			});
		} else if (typeof method == 'object' || ! method) {

			// store args to use later :
			var args = Array.prototype.slice.call(arguments);

			// apply on each :
			this.each(function() {
				$this = $(this);

				// stop if already inited :
				if ($this.data('slidizle_api') != null && $this.data('slidizle_api') != '') return;

				// make a new instance :
				var api = new Slidizle($this, args[0]);

				// save api in element :
				$this.data('slidizle_api', api);
			});
		} else {
			// error :
			$.error( 'Method ' +  method + ' does not exist on jQuery.slidizle' );
		}

		// return this :
		return this;
	}

	// return plugin :
	return Slidizle;

}));