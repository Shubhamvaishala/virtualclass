(function (window) {
    function zoomWhiteboard() {
        return {
            init : function (){
                if(document.querySelector(' .zoomControler') ==  null){
                    var zoomControler = virtualclass.getTemplate('zoomControl');
                    var zoomControlerhtml = zoomControler();
                    var parent = document.querySelector("#virtualclassAppLeftPanel");
                    if(parent != null){
                        parent.insertAdjacentHTML('beforeend', zoomControlerhtml);
                        this._initScaleController();
                        var canvasScale = localStorage.getItem('wbcScale');
                        if(canvasScale != null){
                            this.canvasScale = canvasScale;
                        }
                    }
                }
            },

            _initScaleController : function (){
                var elem = document.querySelector('.zoomControler');
                var that = this;

                var zoomIn = elem.querySelector('.zoomIn');
                zoomIn.addEventListener('click', function (){
                    that.zoomIn();
                });

                var zoomOut = elem.querySelector('.zoomOut');
                zoomOut.addEventListener('click', function (){
                    that.zoomOut();
                });

                var fitScreen = elem.querySelector('.fitScreen');
                fitScreen.addEventListener('click', function (){
                    that.fitToScreen();
                });
            },

            zoomIn : function (normalZoom){
                var wid = virtualclass.gObj.currWb;
                var canvas = virtualclass.wb[wid].vcan.main.canvas;
              //  var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(this.canvasWrapper.style.width);
                var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvas.parentNode.style.width);

                // var canvas = this.canvas;

                this.prvCanvasScale = this.canvasScale;
                this.canvasScale = this.canvasScale * SCALE_FACTOR;

                console.log('Canvas scale ' + this.canvasScale);

                var actualWidth = virtualclass.vutil.getWidth(canvas) * SCALE_FACTOR;
                var actualHeight = virtualclass.vutil.getHeight(canvas) * SCALE_FACTOR;

                if(typeof normalZoom != 'undefined'){
                    virtualclass.pdfRender[wid]._zoom.call(virtualclass.pdfRender[wid], canvas, actualWidth, actualHeight, normalZoom);
                }else {
                    virtualclass.pdfRender[wid]._zoom.call(virtualclass.pdfRender[wid], canvas, actualWidth, actualHeight);
                }

                // this._zoom(canvas, actualWidth, actualHeight);
            },

            zoomOut : function (){
                var wid = virtualclass.gObj.currWb;
                // var wrapper = this.canvasWrapper;
                var canvas = virtualclass.wb[wid].vcan.main.canvas;
                var wrapper = canvas.parentNode;
                //var canvas = this.canvas;
                var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvas.parentNode.style.width);

                this.prvCanvasScale = this.canvasScale;

                // SCALE_FACTOR = (1 - (((virtualclass.zoom.canvasScale * 1) - 0.05) / virtualclass.zoom.canvasScale)) + 1;


                this.canvasScale = this.canvasScale / SCALE_FACTOR;

                var actualWidth  = virtualclass.vutil.getWidth(canvas) * (1 / SCALE_FACTOR);
                var actualHeight = virtualclass.vutil.getHeight(canvas) * (1 / SCALE_FACTOR);

                if(actualWidth <= wrapperWidth){
                    wrapper.classList.remove('scrollX');
                }

                virtualclass.pdfRender[wid]._zoomOut.call(virtualclass.pdfRender[wid], canvas, actualWidth, actualHeight);
            },

            fitToScreen : function (){
                var wid = virtualclass.gObj.currWb;
                var page = virtualclass.pdfRender[wid].page;
                var canvas = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.canvas;
                var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvas.parentNode.style.width) + 50;
                var viewport = page.getViewport((+(wrapperWidth)-100) / page.getViewport(1.0).width);
                this.prvCanvasScale = this.canvasScale;
                this.canvasScale = viewport.scale;
                virtualclass.pdfRender[wid]._fitToScreen.call(virtualclass.pdfRender[wid], canvas, wrapperWidth, canvas.height);
            },

            normalRender : function (){
                if(virtualclass.zoom.canvasScale != null){
                    virtualclass.zoom.canvasScale = virtualclass.zoom.canvasScale / SCALE_FACTOR;
                    virtualclass.zoom.zoomIn('normalRender');
                } else {
                    console.log('canvasScale is not defined yet.');
                }
            }
        };
    }
    window.zoomWhiteboard = zoomWhiteboard;
})(window);
