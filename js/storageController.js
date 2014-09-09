/**
 *  storageController.js
 *  (c) 2013 Masatoshi Teruya.
 */
(function(){
'use strict';

var StorageController = {
    __proto__: null,
    KEY_PREFIX: 'jot.',
    RE_KEY: new RegExp( '^jot[.](.+)$' ),
    RE_PREFIX: new RegExp( '^jot[.]' ),
    NOTIFY_SAVED: 'StorageItemSaved',
    NOTIFY_REMOVED: 'StorageItemRemoved',
    getItem: function( key )
    {
        var pk = this.KEY_PREFIX + key,
            data = data = localStorage.getItem( pk );

        if( data )
        {
            try {
                data = JSON.parse( data );
                data = data.val;
            }
            // force remove invalid data
            catch(e){
                localStorage.removeItem( pk );
                data = undefined;
            }
        }

        return data;
    },
    getKey: function( idx ){
        return localStorage.key( idx );
    },
    getKeys: function()
    {
        var arr = [],
            match;

        for( var i = 0, len = this.length; i < len; i++ )
        {
            match = this.RE_KEY.exec( this.getKey(i) );
            if( match ){
                arr.push( match[1] );
            }
        }
        
        return arr;
    },
    saveItem: function( key, val )
    {
        var obj = {
            'key': key,
            'val': val
        };

        if( key )
        {
            try {
                localStorage.setItem( this.KEY_PREFIX + key, JSON.stringify( obj ) );
            } catch(e){
                console.log( e );
                return e;
            }
        }
        Notification.send( this, this.NOTIFY_SAVED, obj );

        return undefined;
    },
    removeItem: function( key )
    {
        if( this.getItem( key ) ){
            localStorage.removeItem( this.KEY_PREFIX + key );
            Notification.send( this, this.NOTIFY_REMOVED, key );
        }
    },
    replaceItem: function( oldKey, key, val ){
        this.removeItem( oldKey );
        return this.saveItem( key, val );
    }
};

Object.defineProperty( StorageController, 'length', {
    __proto__: null,
    get: function(){
        return localStorage.length;
    },
    enumerable: true
});


// export
window.StorageController = StorageController;

}());
