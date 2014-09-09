(function(){
'use strict';

/*
 *  function _localStorage()
 *  (c) https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage
 */
function _localStorage()
{
    var aKeys = [],
        oStorage = {};
    
    Object.defineProperty( oStorage, "getItem", {
        value: function( sKey ){ 
            return sKey ? this[sKey] : null;
        },
        writable: false,
        configurable: false,
        enumerable: false
    });
    
    Object.defineProperty( oStorage, "key", {
        value: function (nKeyId) { 
            return aKeys[nKeyId];
        },
        writable: false,
        configurable: false,
        enumerable: false
    });
    
    Object.defineProperty( oStorage, "setItem", 
    {
        value: function (sKey, sValue) {
            if( sKey ){ 
                document.cookie = escape(sKey) + "=" + escape(sValue) + "; path=/";
            }
        },
        writable: false,
        configurable: false,
        enumerable: false
    });
    
    Object.defineProperty( oStorage, "length", {
        get: function () { 
            return aKeys.length;
        },
        configurable: false,
        enumerable: false
    });
    
    Object.defineProperty( oStorage, "removeItem", 
    {
        value: function (sKey) {
            if( sKey) {
                var sExpDate = new Date();
                sExpDate.setDate( sExpDate.getDate() - 1 );
                document.cookie = escape(sKey) + 
                                  "=; expires=" + 
                                  sExpDate.toGMTString() +
                                  "; path=/";
            }
        },
        writable: false,
        configurable: false,
        enumerable: false
    });
    
    this.get = function ()
    {
        var iThisIndx;
            
        for( var sKey in oStorage )
        {
            iThisIndx = aKeys.indexOf(sKey);
            if( iThisIndx === -1 ){
                oStorage.setItem(sKey, oStorage[sKey]);
            }
            else { 
                aKeys.splice(iThisIndx, 1);
            }
            delete oStorage[sKey];
        }
            
        for( aKeys; aKeys.length > 0; aKeys.splice(0, 1) ){
            oStorage.removeItem(aKeys[0]);
        }
        
        for( var iCouple, iKey, iCouplId = 0, aCouples = document.cookie.split(/\s*;\s*/);
            iCouplId < aCouples.length; iCouplId++ )
        {
            iCouple = aCouples[iCouplId].split(/\s*=\s*/);
            if( iCouple.length > 1 ){
                oStorage[iKey = unescape(iCouple[0])] = unescape(iCouple[1]);
                aKeys.push(iKey);
            }
        }
        return oStorage;
    };
    
    this.configurable = false;
    this.enumerable = true;
}

// checkLocalStorage
(function()
{
    var testKV = '_checkLocalStorage';
    
    try {
        window.localStorage.setItem( testKV, testKV );
        window.localStorage.removeItem( testKV );
    } catch(e) {
        Object.defineProperty( window, "localStorage", new _localStorage );
    }
}());

}());