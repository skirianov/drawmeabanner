// const rectPositions = [];

// export const createCanvas = (width, height, coordinates, rectWidth, rectHeight) => {
//   const parent = document.getElementById('canvas');
//   parent.innerHTML = '';

//   const parentCoords = parent.getBoundingClientRect();
//   const parentHeight = window.innerHeight;
//   const parentWidth = window.innerWidth;

//   let canvas = document.createElement('canvas')
//   canvas.attributes.id = 'canvas-element';

//   const canvasCoord = canvas.getBoundingClientRect();
//   const coveredDiv = document.createElement('div');
//   coveredDiv.attributes.id = 'covered-div';
//   coveredDiv.style.position = 'absolute';

//   let ctx = canvas.getContext('2d')
//   let cameraOffset = { x: parentWidth / 1.65, y: parentHeight / 4 }
//   let cameraZoom = 1
//   let MAX_ZOOM = 2
//   let MIN_ZOOM = 0.8
//   let SCROLL_SENSITIVITY = 0.0010

//   function draw() {
//     canvas.width = parentWidth;
//     canvas.height = parentHeight;

//     ctx.translate(window.innerWidth / 2, parentCoords.height / 2)
//     ctx.scale(cameraZoom, cameraZoom)
//     ctx.translate(-parentCoords.width + cameraOffset.x, -parentCoords.height + cameraOffset.y)
//     ctx.clearRect(0, 0, parentCoords.width, parentCoords.height)

//     const rect = {
//       x: coordinates[0].x,
//       y: coordinates[0].y,
//     }

//     coveredDiv.style.top = coordinates[0].x + 'px';
//     coveredDiv.style.left = coordinates[0].y + 'px';


//     coordinates.forEach((coordinate, i) => {
//       ctx.fillStyle = coordinate.color;
//       ctx.lineWidth = 0.2;
//       ctx.fillRect(coordinate.x, coordinate.y, rectWidth, rectHeight);
//     })

//     requestAnimationFrame(draw)
//   }

//   // Gets the relevant location from a mouse or single touch event
//   function getEventLocation(e) {
//     if (e.touches && e.touches.length == 1) {
//       return { x: e.touches[0].clientX, y: e.touches[0].clientY }
//     }
//     else if (e.clientX && e.clientY) {
//       return { x: e.clientX, y: e.clientY }
//     }
//   }

//   let isDragging = false
//   let dragStart = { x: 0, y: 0 }

//   function onPointerDown(e) {
//     isDragging = true
//     canvas.style.cursor = 'grabbing'
//     dragStart.x = getEventLocation(e).x / cameraZoom - cameraOffset.x
//     dragStart.y = getEventLocation(e).y / cameraZoom - cameraOffset.y
//   }

//   function onPointerUp(e) {
//     isDragging = false
//     canvas.style.cursor = 'cell'
//     initialPinchDistance = null
//     lastZoom = cameraZoom
//   }

//   function onPointerMove(e) {
//     if (isDragging) {
//       cameraOffset.x = getEventLocation(e).x / cameraZoom - dragStart.x
//       cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y
//     }
//   }

//   function handleTouch(e, singleTouchHandler) {
//     if (e.touches.length == 1) {
//       singleTouchHandler(e)
//     }
//     else if (e.type == "touchmove" && e.touches.length == 2) {
//       isDragging = false
//       handlePinch(e)
//     }
//   }

//   let initialPinchDistance = null
//   let lastZoom = cameraZoom

//   function handlePinch(e) {
//     e.preventDefault()

//     let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
//     let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }

//     // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
//     let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2

//     if (initialPinchDistance == null) {
//       initialPinchDistance = currentDistance
//     }
//     else {
//       adjustZoom(null, currentDistance / initialPinchDistance)
//     }
//   }

//   function adjustZoom(zoomAmount, zoomFactor) {
//     if (!isDragging) {
//       if (zoomAmount) {
//         cameraZoom += zoomAmount
//       }
//       else if (zoomFactor) {
//         cameraZoom = zoomFactor * lastZoom
//       }

//       cameraZoom = Math.min(cameraZoom, MAX_ZOOM)
//       cameraZoom = Math.max(cameraZoom, MIN_ZOOM)

//     }
//   }

//   canvas.addEventListener('mousedown', onPointerDown)
//   canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
//   canvas.addEventListener('mouseup', onPointerUp)
//   canvas.addEventListener('touchend', (e) => handleTouch(e, onPointerUp))
//   canvas.addEventListener('mousemove', onPointerMove)
//   canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
//   canvas.addEventListener('wheel', (e) => adjustZoom(e.deltaY * SCROLL_SENSITIVITY))

//   draw()

//   coveredDiv.appendChild(canvas)

//   parent.appendChild(coveredDiv);
// }

// const collides = (rects, x, y) => {
//   var isCollision = false;
//   for (var i = 0, len = rects.length; i < len; i++) {
//     var left = rects[i].x, right = rects[i].x + rects[i].w;
//     var top = rects[i].y, bottom = rects[i].y + rects[i].h;
//     if (right >= x
//       && left <= x
//       && bottom >= y
//       && top <= y) {
//       isCollision = rects[i];
//     }
//   }
//   return isCollision;
// }

export const createCanvas = (width, height, coordinates, rectWidth, rectHeight) => {
  const canvasContainer = document.getElementById('canvas')
  canvasContainer.innerHTML = ''
  
  let isDragging = false;
  let x_cursor = 0;
  let y_cursor = 0;
  let canvas_x = 0;
  let canvas_y = 0;

  let canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext('2d')

  coordinates.forEach((coordinate, i) => {
    ctx.fillStyle = coordinate.color;
    ctx.lineWidth = 0.2;
    ctx.fillRect(coordinate.x, coordinate.y, rectWidth, rectHeight);
  })


  function zoom(zoomincrement) {
    var pre_width = canvas.getBoundingClientRect().width, pre_height = canvas.getBoundingClientRect().height;
    canvas.style.width = (pre_width * zoomincrement) + 'px';
    canvas.style.height = (pre_height * zoomincrement) + 'px';
    canvas = null;
  }

  function start_drag() {
    isDragging = true;
    canvas = this;
    canvas_x = window.event.clientX - canvas.offsetLeft;
    canvas_y = window.event.clientY - canvas.offsetTop;
  }

  function stop_drag() {
    canvas = null;
  }

  function while_drag() {
    if (isDragging) {}
  }

  canvas.addEventListener('mousedown', start_drag);
  canvasContainer.addEventListener('mousemove', while_drag);
  canvasContainer.addEventListener('mouseup', stop_drag);
  // canvasContainer.addEventListener('wheel', () => zoom(1.1));

  canvasContainer.appendChild(canvas);
}