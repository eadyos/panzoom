var hasEventHandler = function(obj, eventHandler){
	var result = false;
  	//console.log($(obj).data('events')); //old jquery
     //console.log(jQuery._data( obj, "events" ));

    jQuery.each(jQuery._data( obj, "events" ), function(i, event){		if(event[0].type == eventHandler){
			result = true;
		}
	});
	return result;
}

var loadedImages = [];

var panZoom = function(fullImg, viewerDivSelector, angle){

	var img = new Image();

	var loadThis = true;

	function execute(img, width, height) {
		var viewDiv;
		var viewDivWrapper = $('<div>');
		var originalFullWidth;
		var originalFullHeight;
		var fullWidth;
		var fullHeight;
		if(loadThis){
			originalFullWidth = this.width;
			originalFullHeight = this.height;
		}else{
			originalFullWidth = width;
			originalFullHeight = height;
		}
		fullWidth = originalFullWidth;
		fullHeight = originalFullHeight;
		var viewerWidth = 320; //default values if
		var viewerHeight = 200; //constructing our own
		var translateWidth;
		var translateHeight;

		if(angle == 0){
			translateWidth = "0%";
			translateHeight = "0%";
		}else if(angle == 90){
			translateWidth = "0%";
			translateHeight = "-100%";
		}else if(angle == 180){
			translateWidth = "-100%";
			translateHeight = "-100%";
		}else{ //270
			translateWidth = "-100%";
			translateHeight = "0%";
		}


		if(viewerDivSelector){
			viewDiv = $(viewerDivSelector);
			if(!viewDiv.css('width') || !viewDiv.css('height')){
				console.log("The width and height parameters must be specified.");
			}else{
				viewerWidth = viewDiv.width();
				viewerHeight = viewDiv.height();
			}
		}else{
			viewDiv = $('<div>').appendTo('body');
		}
		if(viewerWidth > fullWidth){
			viewerWidth = fullWidth;
		}
		if(viewerHeight > fullHeight){
			viewerHeight = fullHeight;
		}
		//Before we "scale" determine if the image is rotated so
		//we know how to scale properly
		var sideways = false;
		if(angle == 90 || angle == 270) {
			sideways = true;
			//if sideways, height and width are reversed.
			var temp = viewerWidth;
			viewerWidth = viewerHeight;
			viewerHeight = temp;
		}

		//Scale the full view image down so that it fits "inside" the max
		//boundaries of the viewer space
		var viewerThumbWidth = viewerWidth;
		var viewerThumbHeight = viewerHeight;
		var ratio = viewerWidth / fullWidth
		viewerThumbHeight = ratio * fullHeight
		if (viewerThumbHeight > viewerHeight){
			viewerThumbWidth = null
		}
		if (!viewerThumbWidth){
			viewerThumbHeight = viewerHeight;
			ratio = viewerThumbHeight / fullHeight
			viewerThumbWidth = ratio * fullWidth
		}

		var viewMouseMove = function(e){
			var offset = $(this).offset();
			var relMouseX = e.pageX - offset.left;
			var relMouseY = e.pageY - offset.top;
			// var	widthMinusViewer = fullWidth - viewerWidth;
			// var	heightMinusViewer = fullHeight - viewerHeight;
			var leftPercentage;
			var topPercentage;
			var	widthMinusViewer;
			var	heightMinusViewer;
			var topVal;
			var leftVal;
			if(angle == 0 || angle == 180){
				leftPercentage = relMouseX / viewerWidth;
				topPercentage = relMouseY / viewerHeight;
				widthMinusViewer = fullWidth - viewerWidth;
				heightMinusViewer = fullHeight - viewerHeight;
				if(angle == 180){
					leftPercentage = 1.0 - leftPercentage;
					topPercentage = 1.0 - topPercentage;
				}
				topVal = topPercentage * heightMinusViewer;
				leftVal = leftPercentage * widthMinusViewer;
				$(this).css('background-position', (-leftVal) + "px " + (-topVal) + "px");
			}else if(angle == 90 || angle == 270){
				leftPercentage = relMouseX / viewerHeight;
				topPercentage = relMouseY / viewerWidth;
				widthMinusViewer = fullHeight - viewerHeight;
				heightMinusViewer = fullWidth - viewerWidth;
				if(angle == 90){
					leftPercentage = 1.0 - leftPercentage;
				}else{
					topPercentage = 1.0 - topPercentage;
				}
				topVal = topPercentage * heightMinusViewer;
				leftVal = leftPercentage * widthMinusViewer;
				$(this).css('background-position', (-topVal) + "px " + (-leftVal) + "px");
			}else{
				alert("Image Viewer only supports angle values of 0,90,180,270");
			}
		}

		var changeZoomLevel = function(e, delta){
			e.preventDefault();

			var minZoomHeight = (originalFullHeight / 3);
			var minZoomWidth = (originalFullWidth / 3);
			var dir = delta > 0 ? 'Up' : 'Down';
			var zoomFactor = .15;
			var currentZoomFactor = fullHeight / originalFullHeight;
			var newFullWidth;
			var newFullHeight;
			if(dir == 'Down'){
				currentZoomFactor = currentZoomFactor - zoomFactor;
				newFullWidth = originalFullWidth * currentZoomFactor;
				newFullHeight = originalFullHeight * currentZoomFactor;
				if(newFullWidth < minZoomWidth){
					newFullWidth = minZoomWidth;
					newFullHeight = minZoomHeight;
				}
			}else{ //Up
				currentZoomFactor = currentZoomFactor + zoomFactor;
				newFullWidth = originalFullWidth * currentZoomFactor;
				newFullHeight = originalFullHeight * currentZoomFactor;
				if(newFullWidth > originalFullWidth){
					newFullWidth = originalFullWidth;
					newFullHeight = originalFullHeight;
				}
			}
			fullHeight = newFullHeight;
			fullWidth = newFullWidth;
			$(this).css('background-size', fullWidth + "px " + fullHeight + "px");
			//This is completely lazy and wrong... but i'm sick of changing this viewer

			var offset = $(this).offset();
			var relMouseX = e.pageX - offset.left;
			var relMouseY = e.pageY - offset.top;
			// var	widthMinusViewer = fullWidth - viewerWidth;
			// var	heightMinusViewer = fullHeight - viewerHeight;
			var leftPercentage;
			var topPercentage;
			var	widthMinusViewer;
			var	heightMinusViewer;
			var topVal;
			var leftVal;
			if(angle == 0 || angle == 180){
				leftPercentage = relMouseX / viewerWidth;
				topPercentage = relMouseY / viewerHeight;
				widthMinusViewer = fullWidth - viewerWidth;
				heightMinusViewer = fullHeight - viewerHeight;
				if(angle == 180){
					leftPercentage = 1.0 - leftPercentage;
					topPercentage = 1.0 - topPercentage;
				}
				topVal = topPercentage * heightMinusViewer;
				leftVal = leftPercentage * widthMinusViewer;
				$(this).css('background-position', (-leftVal) + "px " + (-topVal) + "px");
			}else if(angle == 90 || angle == 270){
				leftPercentage = relMouseX / viewerHeight;
				topPercentage = relMouseY / viewerWidth;
				widthMinusViewer = fullHeight - viewerHeight;
				heightMinusViewer = fullWidth - viewerWidth;
				if(angle == 90){
					leftPercentage = 1.0 - leftPercentage;
				}else{
					topPercentage = 1.0 - topPercentage;
				}
				topVal = topPercentage * heightMinusViewer;
				leftVal = leftPercentage * widthMinusViewer;
				$(this).css('background-position', (-topVal) + "px " + (-leftVal) + "px");
			}else{
				alert("Image Viewer only supports angle values of 0,90,180,270");
			}

		}

		console.log("Image: " + fullImg)
		console.log("viewerWidth: " + viewerWidth);
		console.log("viewerHeight: " + viewerHeight);

		viewDivWrapper
			.width(viewerWidth)
			.height(viewerHeight)
			.addClass("wrapper")
			.css('background-image', 'url(' + fullImg + ')')
			.css('background-repeat','no-repeat')
			.css('transform' ,'rotate(' + angle + 'deg) translate('+ translateWidth + ',' + translateHeight + ')')
			.css('transform-origin' ,'0% 0%')
			.css('-webkit-transform', 'rotate(' + angle + 'deg) translate('+ translateWidth + ',' + translateHeight + ')')
			.css('-webkit-transform-origin', '0% 0%')
			.css('-ms-transform', 'rotate(' + angle + 'deg) translate('+ translateWidth + ',' + translateHeight + ')')
			.css('-ms-transform-origin', '0% 0%')
			.css('-moz-transform', 'rotate(' + angle + 'deg) translate('+ translateWidth + ',' + translateHeight + ')')
			.css('-moz-transform-origin', '0% 0%')
			.css('-o-transform', 'rotate(' + angle + 'deg) translate('+ translateWidth + ',' + translateHeight + ')')
			.css('background-position', 'center')
			.css('background-size', viewerThumbWidth + "px " + viewerThumbHeight + "px")
			.mousemove(viewMouseMove)
			.mousewheel(changeZoomLevel)
			.mouseout(function(e){
				if(hasEventHandler(this, 'mousemove')){ //if scrolly action is enabled, reset pic
					$(this)
						.css('background-position', "center")
						.css('background-size', viewerThumbWidth + "px " + viewerThumbHeight + "px");
				}//else keep pic frozen
			})
			.mouseenter(function(e){
				$(this).css('background-size', fullWidth + "px " + fullHeight + "px");
				if(!hasEventHandler(this, 'mousemove')){ //enable scrolly action if disabled
					$(this).mousemove(viewMouseMove);
				}
			})
			.mousedown(function(){
				if(hasEventHandler(this, 'mousemove')){
					$(this).unbind('mousemove');
				}else{
					$(this).mousemove(viewMouseMove);
				}
			});

		if(!viewDiv.find('.wrapper').length){
			viewDiv.append(viewDivWrapper);
		}
	}

	img.onload = execute;
	img.src = fullImg;

//For some reason this functionality is now working in Firefox.
//The code below may no longer be needed.
//	if (navigator.userAgent.indexOf("Firefox")!=-1){
//		var found = false;
//		var width;
//		var height;
//		console.log(loadedImages);
//		for(var i = 0;i<loadedImages.length;i++){
//			if(fullImg.indexOf(loadedImages[i].name) >= 0){
//				found = true;
//				loadThis = false;
//				width = loadedImages[i].width;
//				height = loadedImages[i].height;
//			}
//		}
//		if(found){
//			execute(img, width, height);
//		}else{
//			loadedImages.push({name:fullImg, width:img.width, height:img.height});
//		}
//	}

}
