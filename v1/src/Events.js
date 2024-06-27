var Events = (function() {

    function Events(scene, controls) {
        this.scene = scene;
        this.controls = controls;
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };

        this.notify = null;

        this.fps = 30;

        this.animationRunning = true;
        

        this.mouse_drag_started = function(event) {
            this.isDragging = true;
            this.previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        this.mouse_drag_ended = function(event) {
            this.isDragging = false;
        };

        let z = 0;

        this.mouse_dragged = function(event) {
            
            if (this.isDragging) {
                var deltaX = event.clientX - this.previousMousePosition.x;
                var deltaY = event.clientY - this.previousMousePosition.y;
                
                this.scene.angle_y += deltaX * 0.5;
                this.scene.angle_x += deltaY * 0.5;
                
                this.previousMousePosition = { x: event.clientX, y: event.clientY };

                if(this.notify) {
                    if( (z%10) === 0 ) {
                        this.notify(
                            {
                                'mouse_x': this.previousMousePosition.x, 
                                'mouse_y': this.previousMousePosition.y, 
                                'angle_x': this.scene.angle_x, 
                                'angle_y': this.scene.angle_y
                            }
                        )
                    }
                    ++z;
                }
            }
        };

        this.animate = function() {
            var self = this;
            
            var interval = 1000 / self.fps;
            var lastTime = (new Date()).getTime();
        
            function renderLoop() {
                var currentTime = (new Date()).getTime();
                var deltaTime = currentTime - lastTime;
        
                if (deltaTime >= interval) {
                    self.scene.render();
                    lastTime = currentTime - (deltaTime % interval);
                }
        
                if(self.animationRunning) {
                    requestAnimationFrame(renderLoop);
                } 
            }
        
            renderLoop();
        }

        this.startAnimation = function() {
            this.animationRunning = true;
            this.animate();
        }

        this.stopAnimation = function() {
            this.animationRunning = false;
        }

        this.subscribe = function(callback) {
            this.notify = callback;
        }

    } // End Konstruktor

    return Events;
})();

export { Events }