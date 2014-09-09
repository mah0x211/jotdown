/**
 *  datamapper.js
 *  (c) 2014 Masatoshi Teruya.
 */
(function(){
'use strict';

var MAP_EACH = 'data-map-each',
    RE_EACH_KEY = new RegExp( '([a-zA-Z0-9_]+)' ),
    MAP_KV = 'data-map',
    RE_KV = new RegExp( '([a-zA-Z0-9_]+)@([a-zA-Z0-9_]+(?:,[a-zA-Z0-9_]+)*)' );


function mapEachObj2Elm( elm, arr )
{
    var fragment;

    // non-object
    if( typeof arr === 'object' )
    {
        // not array
        if( !( arr instanceof Array ) ){
            arr = [arr];
        }

        if( arr.length )
        {
            fragment = document.createDocumentFragment();
            arr.forEach(function( item ){
                var clone = elm.cloneNode(true);
                clone.removeAttribute( MAP_EACH );
                mapObj2Elm( clone, item );
                fragment.appendChild( clone );
            });
        }
    }

    return fragment;
}

function mapObj2Elm( target, obj )
{
    var elms = target.querySelectorAll( '[' + MAP_EACH + ']' );

    // found MAP_EACH elements
    if( elms )
    {
        Array.prototype.forEach.call( elms, function( elm )
        {
            var marker = document.createTextNode(''),
                attr = elm.getAttribute( MAP_EACH ) || '',
                match = RE_EACH_KEY.exec( elm.getAttribute( MAP_EACH ) ),
                fragment;

            elm.parentNode.replaceChild( marker, elm );
            fragment = mapEachObj2Elm( elm, match && obj[match[1]] );
            if( fragment ){
                marker.parentNode.replaceChild( fragment, marker );
            }
        });
    }

    Array.prototype.forEach
    .call( target.querySelectorAll( '[' + MAP_KV + ']' ), function( elm )
    {
        var match = RE_KV.exec( elm.getAttribute( MAP_KV ) ),
            val = match && obj[match[1]];

        elm.removeAttribute( MAP_KV );
        if( val )
        {
            match[2].replace( /\s+/g, '' ).split(',').forEach(function( prop ){
                elm[prop] = val;
            });
        }
    });
}

function DataMapper( qry )
{
    var marker = document.createTextNode(''),
        tmpl = document.querySelector( qry );

    if( !tmpl ){
        throw new ReferenceError( qry + ' not found.' );
    }

    tmpl.parentNode.replaceChild( marker, tmpl );
    this.map = function( obj )
    {
        var elm = tmpl.cloneNode(true);

        mapObj2Elm( elm, obj );
        marker.parentNode.replaceChild( elm, marker );
        marker = elm;
    };
}

// export
window.DataMapper = DataMapper;

}());
