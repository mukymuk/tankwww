#include <node.h>
#include <v8.h>
#include <modbus/modbus.h>

using namespace v8;

Handle<Value> Method(const Arguments &args)
{
	HandleScope scope;
	return scope.Close(String::New("world"));
}

void init(Handle<Object> target)
{
	NODE_SET_METHOD(target, "hello", Method);
}
NODE_MODULE(x200, init)

void __attribute__ ((constructor))load(void)
{
}

void __attribute__ ((destructor)) unload(void)
{
}
