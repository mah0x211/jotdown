/**
 *  notificaion.js
 *  (c) 2013 Masatoshi Teruya.
 */
(function(){
'use strict';

var Receiver = {
        __proto__: null
    },
    // notification mapping
    // format:
    //      data-notify-send="notification@dom-evt1,dom-evt2"
    //      data-notify-recv="dom-evt@notify1,notify2"
    RE_ATTR = new RegExp(
        '([a-zA-Z0-9_]+)@([a-zA-Z0-9_]+(?:,[a-zA-Z0-9_]+)*)'
    ),
    MAP_SEND_ATTR = 'data-notify-send',
    MAP_RECV_ATTR = 'data-notify-recv';

// add observer for notification
function Notification(){};

Notification.recv = function( obs, method, notify )
{
    var arr;
 
    if( typeof obs !== 'object' || 
        typeof method !== 'string' || 
        typeof notify !== 'string' ){
        throw new TypeError(
            'Notification.recv( obs:obj, method:str, notify:str )' 
        );
    }
    else if( !( arr = Receiver[notify] ) )
    {
        // create new notification object
        arr = [{
            obs: obs,
            method: method
        }];
        Receiver[notify] = arr;
    }
    else
    {
        arr = arr.filter(function(item)
        {
            if( item.obs instanceof HTMLElement && !item.obs.baseURI ){
                return false;
            }
            else if( item.obs === obs && item.method === obs.method ){
                return false;
            }

            return true;
        });

        arr.push({
            obs: obs,
            method: method
        });
        Receiver[notify] = arr;
    }
    
    return arr.length;
};

// send notify
Notification.send = function( sender, notify, ctx )
{
    var arr;
    
    if( typeof sender !== 'object' && typeof notify !== 'string' ){
        throw new TypeError( 
            'Notification.send( sender:obj, notification:str, ctx:any' 
        );
    }
    else if( ( arr = Receiver[notify] ) )
    {
        arr.forEach(function(receiver){
            receiver.obs[receiver.method]( sender, notify, ctx );
        });
    }
}


// notification mapping
function mapSend( elm, notify, evts )
{
    var evt;
 
    elm._notify = notify;
    evts = evts.replace( /\s+/g, '' ).split(',');
    for( var i = 0, len = evts.length; i < len; i++ )
    {
        evt = evts[i];
        evtAddListener( elm, evt, function( evt ){
            Notification.send( this, this._notify );
            evtIgnore( evt );
        });
    }
}

function mapRecv( elm, evt, notify )
{
    evt = evt.replace( /\s+/g, '' );
    notify = notify.replace( /\s+/g, '' ).split(',');
    for( var i = 0, len = notify.length; i < len; i++ ){
        Notification.recv( elm, evt, notify[i] );
    }
}

function mapEach( elm, attr, callback )
{
    // lookup notifiable element
    var elms = elm.querySelectorAll( '[' + attr + ']' ),
        len = elms.length,
        i = 0,
        data, match;
    
    for(; i < len; i++ )
    {
        elm = elms[i];
        // check data-notify-* attribute
        data = elm.getAttribute( attr );
        elm.removeAttribute( attr );
        if( ( match = RE_ATTR.exec( data ) ) ){
            callback( elm, match[1], match[2] );
        }
    }
}

Notification.map = function( qry )
{
    var elm = document.querySelector( ( qry ) ? qry : 'body' );
 
    if( elm ){
        mapEach( elm, MAP_SEND_ATTR, mapSend );
        mapEach( elm, MAP_RECV_ATTR, mapRecv );
    }
};

// export
window.Notification = Notification;

}());

