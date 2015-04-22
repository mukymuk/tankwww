var fs = require('fs');

open = function( ndx )
{
	var buf = new Buffer(1);
	var fd = fs.openSync( "/sys/class/gpio/gpio" + ndx + "/value", 'w+' );
	var o =
	{
		get: function()
		{
			fs.readSync( fd, buf, 0, 1, 0 );
			if( buf[0] == 48 )
				return false;
			return true;
		},
		set: function(state)
		{
			if( state )
				buf[0] = 49;
			else
				buf[0] = 48;
			fs.writeSync( fd, buf, 0, 1, 0 );
		}
	};
	return o;
}

module.exports =
{
	open: open
}

