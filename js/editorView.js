/**
 *  editorView.js
 *  (c) 2013 Masatoshi Teruya.
 */
(function(){
'use strict';

var NOTIFY_OPEN = 'editorOpenItem',
    QRY_VIEW = '.editorView',
    QRY_TITLE = '.sourceTitle input',
    QRY_TEXTAREA = '.sourceView textarea',
    QRY_RESIZE_KNOB = '.sourceView .resizeKnob',
    QRY_TRACKING_SHEET = '.renderView .trackingSheet',
    CLASS_CONFLICT = 'conflicted',
    MAPPER = new DataMapper( QRY_VIEW ),
    REC, TEXTAREA;

function trackResizeKnob( x, y, type, ctx )
{
    if( type === MouseTracker.START ){
        var sourceView = document.querySelector('.sourceView'),
            padding = 200;
        
        ctx.WIDTH = sourceView.clientWidth;
        ctx.MAX_WIDTH = ctx.WIDTH - padding;
        ctx.MIN_WIDTH = padding;
        ctx.view = document.querySelector('.sourceView > p');
        ctx.width = ctx.view.clientWidth;
        ctx.trackSheet = document.querySelector( QRY_TRACKING_SHEET ),
        ctx.trackSheet.style.display = 'block';
    }
    else if( x )
    {
        var modify = ctx.width + x;
        
        if( modify > ctx.MIN_WIDTH && modify < ctx.MAX_WIDTH )
        {
            switch( type ){
                case MouseTracker.PROGRESS:
                    ctx.view.style.width = modify + 'px';
                break;
                case MouseTracker.END:
                    ctx.view.style.width = Math.round( modify / ctx.WIDTH * 100 ) + '%';
                    ctx.trackSheet.style.display = 'none';
                break;
            }
        }
    }
    
    return true;
}


// receive notification
var Receiver = {
    __proto__: null,
    create: function( data ){
        REC = StorageItem.create( data );
        MAPPER.map( REC );
        // mapping element
        Notification.map( QRY_VIEW );
        TEXTAREA = new TextArea( QRY_TEXTAREA );
        MouseTracker.listen(
            document.querySelector( QRY_RESIZE_KNOB ), 
            trackResizeKnob
        );
        Notification.send( this, NOTIFY_OPEN, data );
    },
    createDraft: function(){
        this.create();
    },
    openEditor: function()
    {
        if( !REC ){
            this.create();
        }
    },
    changeTitle: function( title, notify )
    {
        var newName = title.value;
        
        // remove class conflict
        if( REC.name === newName ){
            elmRemoveClass( title, CLASS_CONFLICT );
        }
        // add class conflict
        else if( StorageController.getItem( newName ) ){
            elmAddClass( title, CLASS_CONFLICT );
        }
        // set new name
        else {
            elmRemoveClass( title, CLASS_CONFLICT );
            REC.setName( newName );
        }
    },
    changeTextarea: function( elm, notify ){
        REC.setSrc( TEXTAREA.value );
    }
};

Object.keys( Receiver ).forEach(function( key ){
    Notification.recv( Receiver, key, key );
})

// export
var EditorView = {
    __proto__: null,
    NOTIFY_OPEN: NOTIFY_OPEN,
    // delegate
    isEdited: function( name ){
        return REC && REC.name === name || false;
    },
    openItem: function( data ){
        Receiver.create( data );
    },
    content: function(){
        return REC && {
            epoch: REC.epoch,
            name: REC.name,
            src: REC.src
        } || null;
    }
};

window.EditorView = EditorView;

}());
