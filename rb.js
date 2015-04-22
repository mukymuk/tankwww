var gpio = require('./gpio');

var rb = 
[
	[
		gpio.open(47),
		gpio.open(46),
		gpio.open(27),
		gpio.open(61),
		gpio.open(86),
		gpio.open(88),
		gpio.open(87),
		gpio.open(89)
	],
	[
		gpio.open(77),
		gpio.open(76),
		gpio.open(78),
		gpio.open(79),
		gpio.open(8),
		gpio.open(11),
		gpio.open(9),
		gpio.open(81)
	]

];

open = function( board, relay )
{
	var o =
	{
		board:board,
		relay:relay,
		get:function()
		{
			return rb[o.board][o.relay].get();
		},
		set:function(state)
		{
			rb[o.board][o.relay].set(state);
		}
	};
	return o;
}

module.exports =
{
	open:open
}
