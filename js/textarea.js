/**
 *  textarea.js
 *  (c) 2013 Masatoshi Teruya.
 */
(function(){
'use strict';

var HT_CHR = 0x9,
    HT2SP_LEN = 4,
    SANITIZER = document.createElement('div');

function sanitizeText( str ){
    SANITIZER.innerText = str;
    return SANITIZER.innerText;
}

function insertTabKey( elm )
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
    elm.value = sanitizeText( txt );
    // set caret
    elm.selectionStart = cursor;
    elm.selectionEnd = cursor;
}


function checkTabKey( evt )
{
    if( evt.which === HT_CHR ){
        evtIgnore( evt );
        insertTabKey( evt.target );
        return false;
    }
}


function TextArea( qry )
{
    var elm = document.querySelector(qry);
 
    if( !elm ){
        throw new ReferenceError( qry + ' not found' );
    }
    // properties
    // get/set value
    Object.defineProperty( this, 'value', {
        __proto__: null,
        get: function(){
            return elm.value;
        },
        set: function( val ){
            elm.value = sanitizeText( val );
        }
    });
    
    // add event hooks
    evtAddListener( elm, 'keydown', checkTabKey );
}

// export
window.TextArea = TextArea;

}());

