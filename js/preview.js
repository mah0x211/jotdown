/**
 *  preview.js
 *  (c) 2014 Masatoshi Teruya.
 */
(function(){
'use strict';

var NOTIFY_RENDER_SELECTED = 'renderSelected',
    RENDER_SRC = {
        __proto__: null,
        renderNone: '',
        renderHTML: 'preview/html.html',
        renderMarkdown: 'preview/markdown.html'
    },
    renderType = 'renderNone',
    MARKER, FRAME, SANDBOX, MSG;

function sendMessage()
{
    if( SANDBOX && MSG ){
        SANDBOX.postMessage( MSG, '*' );
        MSG = null;
    }
}

function saveNotifyMessage( sender, notify, obj )
{
    MSG = obj.val;
    sendMessage();
}

function recvMessage( evt )
{
    SANDBOX = evt.source;
    MSG = EditorView.content();
    sendMessage();
}
// subscribe sandbox message
evtAddListener( window, 'message', recvMessage );

function setPreviewFrame()
{
    var frame = document.querySelector('#sandbox'),
        src = RENDER_SRC[renderType],
        elm;

    SANDBOX = null;
    if( renderType === 'renderNone' || !src ){
        elm = document.createElement('div');
    }
    else {
        elm = document.createElement('iframe');
        elm.src = src;
    }

    elm.id = 'sandbox';
    frame.parentNode.replaceChild( elm, frame );
}

function changeRenderType( sender, notify )
{
    if( renderType !== notify ){
        renderType = notify;
        Notification.send( this, NOTIFY_RENDER_SELECTED );
        setPreviewFrame();
    }
}

// receive notification
var Receiver = {
    __proto__: null,
};
// select render type notifications
Object.keys( RENDER_SRC ).forEach(function( notify ){
    Receiver[notify] = changeRenderType
});
// editor open notification
Receiver[EditorView.NOTIFY_OPEN] = function(){
    renderType = 'renderNone';
    setPreviewFrame();
};
// storage save notification
Receiver[StorageController.NOTIFY_SAVED] = saveNotifyMessage;

Object.keys( Receiver ).forEach(function( key ){
    Notification.recv( Receiver, key, key );
})


}());
