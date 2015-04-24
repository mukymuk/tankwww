var gpio = require('./gpio');
var log = require('./log').log;
var alarm = require('./alarm');
var inital = 2;

var input =
[
	gpio.open(60), gpio.open(30), gpio.open(31), gpio.open(48)
];

var targets;

checkInput = function()
{
	var length = targets.length;
	for( var i=0;i<length;i++)
	{
		var o = targets[i];
		var current = o.gpio.get();
		//log( "%d: %d, %d, coung=%d", i, current, o.last, o.debounce_count );
		if( current != o.last )
		{
			o.debounce_count = o.debounce;
			o.last = current;
		}
		else
		{
			if( o.debounce_count )
			{
				if( !--o.debounce_count)
				{
					if(  current != o.callback_current  )
					{
						o.callback_value = current;
						o.callback(current);
					}
				}
			}
		}
	}
}

register = function( in_ndx, callback, debounce )
{
	if( typeof targets == 'undefined' )
	{
		 targets = new Array();
	}
	var o =
	{
		gpio: input[in_ndx],
		callback: callback,
		debounce: debounce,
		debounce_count: debounce,
		last: inital,
		callback_current: inital
	};
	targets.push( o );
	return o;
}

unregister = function( o )
{
}

setInterval( checkInput, 1000 );

module.exports = 
{
	register:register,
	unregister:unregister,
	topoff:0
}
