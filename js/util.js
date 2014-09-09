/**
 *  util.js
 *
 *  NOTE: 
 *      do not use Object.defineProperty on IE8.
 *      IE8's Object.defineProperty can use only for DOM object.
 *
 *  (c) 2013 Masatoshi Teruya.
 */

'use strict';

function trimSpaces( str ){
    return (str || '').replace( /\s+/g, ' ' ).replace( /(?:^\s+|\s$)/g, '' );
}

/* element class property */
function elmAddClass( elm, className )
{
    var names = trimSpaces( elm.getAttribute('class') ).split( /\s+/ );
    
    if( names.indexOf( className ) === -1 ){
        names.push( className );
        elm.setAttribute( 'class', names.join(' ') );
    }
}

function elmRemoveClass( elm, className )
{
    var names = trimSpaces( elm.getAttribute('class') ).split( /\s+/ ),
        idx = names.indexOf( className );
    
    if( idx !== -1 ){
        names[idx] = '';
        elm.setAttribute( 'class', names.join(' ').replace( /\s+/g, ' ' ) );
    }
}

/* define property */
function defineProtectedProperty( obj, name, getter, setter )
{
    Object.defineProperty( obj, name, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: false
    });
}

function defineMethodProperty( obj, name, method )
{
    Object.defineProperty( obj, name, {
        value: method,
        enumerable: false,
        configurable: false
    });
}

(function(){

// emulate Object.defineProperty method
function emuDefineProperty( obj, prop, desc )
{
    if( 'value' in desc ){
        obj[prop] = desc['value'];
    }
    if( desc['set'] ){
        Object.__defineSetter__.call( obj, prop, desc['set'] );
    }
    if( desc['get'] ){
        Object.__defineGetter__.call( obj, prop, desc['get'] );
    }
}

// check Object.defineProperty method
if( typeof Object.defineProperty !== 'function' ){
    Object.defineProperty = emuDefineProperty;
}

}());
