/**
 *  events.js
 *
 *  (c) 2014 Masatoshi Teruya.
 */
'use strict';

function evtStopFlow( evt )
{
    if( evt.stopPropagation ){
        evt.stopPropagation();
    }
    else {
        evt.cancelBubble = true;
    }
}

function evtCancel( evt )
{
    if( evt.preventDefault ){
        evt.preventDefault();
    }
    else {
        evt.returnValue = false;
    }
}

function evtIgnore( evt ){
    evtCancel( evt );
    evtStopFlow( evt );
}


(function(){

function evtProxy( evt )
{
    var listener = this._eventsContainer && this._eventsContainer[evt.type];
 
    if( listener instanceof Array )
    {
        for( var i = 0, len = listener.length; i < len; i++ ){
            listener[i].call( this, evt );
        }
    }
}

function evtGetListener( elm, type )
{
    elm._eventsContainer = elm._eventsContainer || { __proto__: null };
    return elm._eventsContainer[type];
}

function evtAddListener( elm, type, func, useCapture )
{
    var listener = evtGetListener( elm, type );
 
    if( !listener ){
        listener = [func];
        elm._eventsContainer[type] = listener;
        elm.addEventListener( type, evtProxy, useCapture );
    }
    else if( listener.indexOf( func ) == -1 ){
        listener.push( func );
    }
}

function evtRemoveListener( elm, type, func, useCapture )
{
    var listener = evtGetListener( elm, type );
 
    if( listener )
    {
        if( func )
        {
            var idx = listener.indexOf( func );
 
            if( idx != -1 )
            {
                listener.splice( idx, 1 );
                if( !listener.length ){
                    elm._eventsContainer[type] = null;
                    elm.removeEventListener( type, evtProxy, useCapture );
                }
            }
        }
        // remove all listener
        else {
            elm._eventsContainer[type] = null;
            elm.removeEventListener( type, evtProxy, useCapture );
        }
    }
}

window.evtAddListener = evtAddListener;
window.evtRemoveListener = evtRemoveListener;

}());

