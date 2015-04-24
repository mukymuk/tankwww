var debug = require('debug')('control');
tick = function()
{
    debug('tick');
}

module.exports = 
{
    tick: tick
};
