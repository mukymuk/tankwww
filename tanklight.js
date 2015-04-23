var rb = require('./rb');
var gpio = require('./gpio');

var daytime;

var override = false;

var left = 
{ 
	power: gpio.open(51), 
	p750: gpio.open(70),
	p1000: gpio.open(80),
	p1100: gpio.open(44)
};
var center = 
{ 
	power: gpio.open(45), 
	p750: gpio.open(68),
	p1000: gpio.open(23),
	p1100: gpio.open(116)
};
var right = 
{ 
	power: gpio.open(50), 
	p750: gpio.open(66),
	p1000: gpio.open(67),
	p1100: gpio.open(69)
};

var lamps = new Array();

var fanState;

daytime = function()
{
	return fanState;
}

open = function( light )
{
	var fan = rb.open(0,3);
	fanState = fan.get();

	var o =
	{
		set: function( state )
		{
			if( state !=  o.get() && (override == false) )
			{
				l = eval(light);
				switch( state )
				{
					case 0:
					{
						l.power.set(false);
						l.p750.set(false);
						l.p1000.set(false);
						l.p1100.set(false);
						var sum = 0;
						for( var i=0;i<lamps.length;i++ )
						{
							sum += lamps[i].get();
						}
						if( !sum )
						{
							fanState = false;
						}
						break;
					}
					case 600:
					{
						l.p750.set(false);
						l.p1000.set(false);
						l.p1100.set(false);
						l.power.set(true);
						fanState = true;
						break;
					}
					case 750:
					{
						l.p1100.set(false);
						l.p1000.set(false);
						l.p750.set(true);
						l.power.set(true);
						fanState = true;
						break;
					}
					case 1000:
					{
						l.p1100.set(false);
						l.p1000.set(true);
						l.p750.set(true);
						l.power.set(true);
						fanState = true;
						break;
					}
					case 1100:
					{
						l.p1100.set(true);
						l.p1000.set(true);
						l.p750.set(true);
						l.power.set(true);
						fanState = true;
						break;
					}
				}
			}
			if( fanState != fan.get() )
			{

				fan.set(fanState);
			}
		},
		get: function()
		{
			l = eval(light);
			if( l.p1100.get() )
				return 1100;
			if( l.p1000.get() )
				return 1000;
			if( l.p750.get() )
				return 750;
			if( l.power.get() )
				return 600;
			return 0;
		}
	};
	lamps.push(o);
	return o;
}

module.exports =
{
	open: open,
	daytime: daytime
};

