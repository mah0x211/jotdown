
function TextArea( qry )
{
    var self = this,
        elm = document.querySelector(qry),
        HT_CHR = 0x9,
        HT2SP_LEN = 4,
        sanitizer = document.createElement('div'),
        evtStopFlow = function( evt )
        {
            if( evt.stopPropagation ){
                evt.stopPropagation();
            }
            else {
                evt.cancelBubble = true;
            }
        },
        evtCancel = function( evt )
        {
            if( evt.preventDefault ){
                evt.preventDefault();
            }
            else {
                evt.returnValue = false;
            }
        },
        evtIgnore = function( evt ){
            evtCancel( evt );
            evtStopFlow( evt );
        },
        sanitize = function( str ){
            sanitizer.innerText = str;
            return sanitizer.innerText;
        },
        insertTabKey = function( evt )
        {
            var txt = elm.value,
                start = elm.selectionStart,
                end = elm.selectionEnd,
                cursor = start + HT2SP_LEN;
            
            txt = [
                txt.slice( 0, start ), 
                (new Array(HT2SP_LEN+1)).join(' '), 
                txt.slice( end )
            ].join('');
            elm.value = sanitize( txt );
            // set caret
            elm.selectionStart = cursor;
            elm.selectionEnd = cursor;
        },
        checkTabKey = function( evt )
        {
            if( evt.which === HT_CHR ){
                evtIgnore( evt );
                insertTabKey();
                return false;
            }
        };
    
    if( !elm ){
        throw new ReferenceError( qry + ' not found' );
    }
    // add properties
    Object.defineProperty( this, 'value', {
        __proto__: null,
        get: function(){
            return elm.value;
        },
        set: function( val ){
            elm.value = sanitize( val );
        }
    });
    // set onchange event hook
    Object.defineProperty( this, 'onchange', {
        __proto__: null,
        set: function( callback )
        {
            elm.addEventListener( 'keyup', function(){
                callback( self.value );
            });
        }
    });
    // add event hooks
    elm.addEventListener( 'keydown', checkTabKey );
}


