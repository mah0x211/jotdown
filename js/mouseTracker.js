/**
 *  track.js
 *  (c) 2013 Masatoshi Teruya.
 */
(function(){
'use strict';

/* mouse tracker */
var START = 1 << 0,
    PROGRESS = 1 << 1,
    END = 1 << 2,
    CALLBACK, ORIGIN, CONTEXT;

function trackFinish( evt )
{
    evtRemoveListener( window, 'mouseup', trackEnd );
    evtRemoveListener( window, 'mousemove', trackProgress );
    CALLBACK = ORIGIN = CONTEXT = undefined;
}

function trackDist( evt, type )
{
    if( !CALLBACK( evt.screenX - ORIGIN.x, evt.screenY - ORIGIN.y, type, CONTEXT ) || 
        type === END ){
        trackFinish( evt );
    }
}

/* track events */
function trackProgress( evt ){
    trackDist( evt, PROGRESS );
    return false;
}

function trackEnd( evt ){
    trackDist( evt, END );
    return false;
}

function trackStart( evt )
{
    var elm = evt.target,
        ctx = {};
    
    evtIgnore( evt );
    if( elm._trackCallback( evt.x, evt.y, START, ctx ) ){
        CALLBACK = elm._trackCallback;
        ORIGIN = { x: evt.screenX, y: evt.screenY };
        CONTEXT = ctx;
        evtAddListener( window, 'mouseup', trackEnd );
        evtAddListener( window, 'mousemove', trackProgress );
    }
    
    return false;
}


function trackListen( elm, callback )
{
    elm._trackCallback = callback;
    evtAddListener( elm, 'mousedown', trackStart );
}

// export
window.MouseTracker = {
    START: START,
    PROGRESS: PROGRESS,
    END: END,
    listen: trackListen
};

}());

