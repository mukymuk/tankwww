var gpio = require('./gpio');

var config =
{
	general:
	{
		count: 3,
		pulse: [ 200, 100 ],
		delay: 60000
	},
	close:
	{
		count: 1,
		pulse: [ 100, 0 ],
		delay: 0
	},
	open:
	{
		count: 2,
		pulse: [ 100, 50 ],
		delay: 0
	},
	start:
	{
		count: 4,
		pulse: [ 333, 667 ],
		delay: 0
	}
};


var alarm = gpio.open(71);
var id;

buzz = function( config, cb )
{
	id = setInterval( 	function() 
						{	
							if( config.count )
							{
								alarm.set(true);	
								setTimeout(	function() { alarm.set(false); }, config.pulse[0] );	
								config.count--;
							}
							else
							{
								clearInterval(id);
								if( config.delay )
									setTimeout( function() { buzz(config) }, config.delay );
								if ( typeof cb !== 'undefined' && cb )
								{			
									cb();
								}
							}
						}, config.pulse[0] + config.pulse[1] );
}

set = function( config, cb )
{
	config.count = config.count;
	buzz( config, cb );
}

clear = function()
{
	clearTimeout(id);
	alarm.set(false);
}

clear();

module.exports = 
{
	set: set,
	clear: clear,
	config: config
}
