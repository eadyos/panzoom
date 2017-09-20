# PanZoom
Javascript image pan and zoom script

### Demo

Link: [PanZoom Demo](http://panzoom.herokuapp.com/index.html)

### About

Panzoom was created so that images can be zoomed and the zoom location could be paused. This was needed for image transcribing purposes. It was also intended to be simple. All you need is a container div and panzoom does the rest. Only 1 image size is needed. It also has built-in, client-side rotation support. This was useful for scanned documents that weren't always the correct perspective.

**panZoom(imageFile, container, rotationAngle);**

Usage Example:
```
	<div id="myViewerDiv"></div>

	<script type="text/javascript">
	  panZoom("cat.jpg", '#viewerDiv', 0);
	</script>	
```

1) Pan with the mouse pointer
2) Use the mousewheel to zoom
3) Click the image to freeze it in place. Useful for keeping the image in a position while you focus on another screen element, input field, etc.
4) Viewer supports client-side image rotation at 0, 90, 180, 270 degrees


Tested in Chrome, Firefox, Safari, Edge


### Requirements

PanZoom requires JQuery and JQuery mousewheel plugin.

