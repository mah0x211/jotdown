/**
 *  app.js
 *  (c) 2013 Masatoshi Teruya
 */
 
(function(){
'use strict';

function main(){
    // remove load event
    evtRemoveListener( this, 'load', main );
    Notification.map('.splitView');
}

evtAddListener( window, 'load', main );

}());
