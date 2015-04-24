#include <node.h>
#include <v8.h>
#include <modbus/modbus.h>
#include <errno.h>
#include <unistd.h>
using namespace v8;

static modbus_t * s_p_modbus;

static char s_error[256];

static void x200_close( void )
{
	modbus_free(s_p_modbus);
	s_p_modbus = NULL;
}

static bool x200_open( void )
{
	if( !( s_p_modbus = modbus_new_rtu("/dev/ttyO1", 19200, 'N', 8, 1) ) )
	{
		snprintf(s_error, sizeof(s_error), "failed to open /dev/ttyO1:  %s\r\n", modbus_strerror(errno) );
		return false;
	}
    //modbus_set_debug( s_p_modbus, TRUE );
	modbus_set_slave(s_p_modbus, 1);
	if( modbus_connect(s_p_modbus) == -1 )
	{
		snprintf(s_error, sizeof(s_error), "failed to connect:  %s\r\n", modbus_strerror(errno) );
		x200_close();
		return false;
	}
	return true;
}


static bool x200_set_freq( uint16_t hz10 )
{
    uint8_t	on;
    if( hz10 == 0 )
	{
		on = 0;
		if( modbus_write_bits(s_p_modbus, 0, 1, &on ) == -1 )
		{
			snprintf(s_error, sizeof(s_error), "failed to turn off:  %s\r\n", modbus_strerror(errno) );
			return false;
		}
	}
	else if( hz10 )
	{
		on = 1;
		if( modbus_write_bits(s_p_modbus, 0, 1, &on ) == -1 )
		{
			snprintf(s_error, sizeof(s_error),"failed to turn on:  %s\r\n", modbus_strerror(errno) );
			return false;
		}
	}
    usleep(5000);
	if( modbus_write_register( s_p_modbus, 1, hz10 ) == -1 )
	{
		snprintf(s_error, sizeof(s_error),"failed to set speed: %s\r\n", modbus_strerror(errno) );
		return false ;
	}
	return true;
}

bool x200_get_freq( uint16_t *hz10 )
{
	if( modbus_read_registers( s_p_modbus, 0x1001, 1, hz10 ) == -1 )
	{
		snprintf(s_error, sizeof(s_error),"failed to read speed: %s\r\n", modbus_strerror(errno) );
		return false ;
	}
	return true;
}
Handle<Value> open(const Arguments &args)
{
	HandleScope scope;
	if( !x200_open() )
	{
		ThrowException( Exception::Error( String::New(s_error)) );
	}
	return scope.Close(Undefined());
}

Handle<Value> close(const Arguments &args)
{
	HandleScope scope;
	x200_close();
	return scope.Close(Undefined());
}

Handle<Value> frequency(const Arguments &args)
{
	Local<Number> speed;
	HandleScope scope;
	int len = args.Length();
	if( len == 1 )
	{
		if(  args[0]->IsNumber() )
		{
			speed = args[0]->ToNumber();
			if( !x200_set_freq( (uint16_t)(speed->Value()*10) ) )
			{
				ThrowException( Exception::Error( String::New(s_error)) );
				return scope.Close(Undefined());
			}
		}
		else
		{
			ThrowException( Exception::TypeError( String::New("Requires a number.")) );
			return scope.Close(Undefined());
		}
		usleep(5000);
	}
	uint16_t hz10;
	if( !x200_get_freq( &hz10 ) )
	{
		ThrowException( Exception::Error( String::New(s_error)) );
		return scope.Close(Undefined());
	}
	speed = Number::New( ((double)hz10) / 10.0 );
	return scope.Close( speed );
}

void init(Handle<Object> target)
{
	NODE_SET_METHOD(target, "frequency", frequency);
	NODE_SET_METHOD(target, "open", open);
	NODE_SET_METHOD(target, "close", close);
}
NODE_MODULE(x200, init)

