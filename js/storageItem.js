/**
 *  storageItem.js
 *  (c) 2013 Masatoshi Teruya.
 */
(function(){
'use strict';

function StorageItem( obj )
{
    var rec = {
            'epoch': Date.now(), 
            'name': '',
            'src': ''
        };
    
    // init with obj
    if( obj ){
        Object.keys( rec ).forEach(function(key){
            rec[key] = obj[key] || rec[key];
        });
    }
    
    defineProtectedProperty( this, 'epoch', function(){
        return rec.epoch;
    });
    defineProtectedProperty( this, 'date', function(){
        return (new Date(rec.epoch)).toString();
    });
    
    defineProtectedProperty( this, 'name', 
        function(){
            return rec.name;
        }
    );
    defineMethodProperty( this, 'setName', 
        function( newName )
        {
            var oldName = rec.name;
            
            if( typeof newName !== 'string' ){
                return new TypeError(
                    'StorageItem.name must be type of string' 
                );
            }
            else if( !newName.trim() ){
                return new TypeError(
                    'StorageItem.name length must be more than one characters.' 
                );
            }
            
            rec.name = newName;
            rec.epoch = Date.now();
            
            return StorageController.replaceItem( oldName, newName, rec );
        }
    );

    defineProtectedProperty( this, 'src', 
        function(){
            return rec.src;
        }
    );
    defineMethodProperty( this, 'setSrc',
        function( newSrc )
        {
            if( typeof newSrc !== 'string' ){
                throw new TypeError('StorageItem.src must be type of string' );
            }
            
            rec.epoch = Date.now();
            rec.src = newSrc;
            return StorageController.saveItem( rec.name, rec );
        }
    );
}

// export
window.StorageItem = {
    create: function( item ){
        return new StorageItem( item )
    }
};

}());
