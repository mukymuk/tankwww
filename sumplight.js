var rb = require('./rb');


open = function()
{
	var o =
	{
		pair:
		[
			rb.open(0,1),
			rb.open(0,2)
		],
		set:function( state )
		{
			if( o.get() != state )
			{
				o.pair[0].set( state );
				o.pair[1].set( state );
			}
		},
		get:function()
		{
			return o.pair[0].get() && o.pair[1].get();
		}
	};
	return o;
}

module.exports = 
{
	open:open
}
