/**
 *  switch.js
 *  (c) 2013 Masatoshi Teruya
 */
 (function(){
'use strict';

var PREFIX_SWITCH = 'switch',
    PREFIX_SELECT = 'select';

function Switcher( elms, selected )
{
    var selected,
        items = {},
        receiver = {},
        selectSwitch = function( elm )
        {
            if( selected ){
                selected.checked = false;
            }
            selected = elm;
            selected.checked = true;
        },
        onChange = function()
        {
            var prev = selected;
            
            selectSwitch( this );
            Notification.send( this, this._sendName, prev );
        },
        notifyHandler = function( sender, notify, ctx )
        {
            if( items[notify] ){
                onChange.apply( items[notify] );
            }
        };
    
    this.add = function( elm )
    {
        var key = elm.getAttribute('id'),
            notify;
        
        // if no-id
        if( !key || !key.trim() )
        {
            // ignore this elements if no-name
            if( !( key = elm.getAttribute('name') ) || !key.trim() ){
                console.log( 'ignore: element has no id/name property', elm );
                return false;
            }
        }
        
        // to capitalize first-letter
        key = key.replace( /^./, key[0].toUpperCase() );
        
        // notification receiver
        notify = PREFIX_SWITCH +  key;
        items[notify] = elm;
        receiver[notify] = notifyHandler;
        Notification.recv( receiver, notify, notify );
        
        // notification sender
        key = PREFIX_SELECT + key;
        elm._sendName = key;
        
        // set change event
        evtAddListener( elm, 'change', onChange );
        // set current selected item if checked attribute is true
        if( elm.checked ){
            selectSwitch( elm );
        }
    };
}

function createSwitcher( qry )
{
    var elms = document.querySelectorAll( qry ),
        selector = new Switcher(),
        len = elms.length,
        i = 0;
    
    for(; i < len; i++ ){
        selector.add( elms[i] );
    }
    
    return selector;
}

// export
window.Switcher = {
    create: createSwitcher
};

}());
