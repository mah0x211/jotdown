/**
 *  itemView.js
 *  (c) 2013 Masatoshi Teruya.
 */
(function(){
'use strict';

var QRY_VIEW = '.storageView',
    QRY_ELM_TITLE = '.storageView .chunkTitle',
    QRY_ELM_REMOVE = '.storageView .chunkItem button',
    MAPPER = new DataMapper( QRY_VIEW );

function confirmRemoveItem( key, isEdited )
{
    if( isEdited )
    {
        return window.confirm( 
            '"' + key + '" is currently editing item. ' + 
            'are you sure to remove this item?' 
        );
    }
    
    return window.confirm( 
        'are you sure to remove "' + key + '" from your storage?' 
    );
}


function setInteraction()
{
    var elms, elm, i, len;
    
    // interaction for remove button
    elms = document.querySelectorAll( QRY_ELM_REMOVE );
    for( i = 0, len = elms.length; i < len; i++ )
    {
        elm = elms[i];
        evtAddListener( elm, 'click', function()
        {
            var key = this.getAttribute('title');
            
            if( confirmRemoveItem( key, EditorView.isEdited( key ) ) ){
                StorageController.removeItem( key );
            }
        });
    }
    // interaction for title
    elms = document.querySelectorAll( QRY_ELM_TITLE );
    for( i = 0, len = elms.length; i < len; i++ )
    {
        elm = elms[i];
        evtAddListener( elm, 'click', function()
        {
            var key = this.getAttribute('title'),
                data = StorageController.getItem( key );
            
            if( data ){
                EditorView.openItem( data );
            }
        });
    }
}

// rendering
function reloadItems()
{
    var keys = StorageController.getKeys(),
        data = {
            'total': keys.length,
            'items': []
        };

    if( data.total )
    {
        var item;
        
        for( var i = 0; i < data.total; i++ )
        {
            if( ( item = StorageController.getItem( keys[i] ) ) )
            {
                data['items'].push({
                    'name': keys[i],
                    'epoch': (new Date(item.epoch)).toString()
                });
            }
        }
    }

    MAPPER.map( data );
    setInteraction();
}

var Receiver = {
    __proto__: null,
    // rendering
    reload: reloadItems,
    openStorage: reloadItems
};
Receiver[StorageController.NOTIFY_REMOVED] = reloadItems;

Object.keys( Receiver ).forEach(function( key ){
    Notification.recv( Receiver, key, key );
});

}());
