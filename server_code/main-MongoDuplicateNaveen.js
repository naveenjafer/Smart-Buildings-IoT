var http = require('http');
var dgram = require('dgram');
var url = require("url");
var s = require('fs');

var mongodb=require('mongodb');
var MongoClient= mongodb.MongoClient;
var url = "mongodb://localhost:27018/iot" ;
var file = require('fs');
var chat_client = require('dgram').createSocket('udp4');
var val = true;
var rand_id = 0;
var stock = [];
var stock_count = 0;
var final_list = [];
var send_string = "";
var node_string = "";
var udp_port = 4999;
var xbee_port = 25001;
var client_ip=[];
var danger_port = 6001;
var pir_port = 10001;
var smoke_port  = 20001;
var node_port = 7001;
var trigger_param = 10;
var trigger_set_id = 0;
var nodes = [];
var temp_avg;//the blow up limit of temperature.
var udp_gateway_port;
var udp_gateway_ip = "";
var io = require('socket.io');
var graph_io = require('socket.io');
var pir_value = "";
var sensory = "";
var gateways = [[],[]];
var user_count = 0;
//var mraa = require('mraa');
var buffer = new Buffer(1024);
//var Led = new mraa.Gpio(13); 
//var sensor = new mraa.Aio(0);
//var light_sensor = new mraa.Aio(1);
var analog = 0;
var average = 0;
var light_val = 0;
var date = 0;
var data = "";
//Led.dir(mraa.DIR_OUT); 
var server = http.createServer(function (request, response) {
var t = request.connection.remoteAddress;
var t_port = request.connection.remotePort;
console.log("The remote port is @"+t_port);
if(client_ip.indexOf(t) < 0){
client_ip.push(t);
}
var path = url.parse(request.url).pathname;
var temp;
console.log(path);

if(path == '/'){
   temp = path + 'iot_testbed.html';
 
   s.readFile(__dirname + temp, function(error, data){
                    if (error){
                        response.writeHead(404);
                        response.write("opps boy this doesn't exist - 404");
                        response.end();
                    }
                    else{
                        response.writeHead(200, {"Content-Type": "text/html"});
                        response.write(data, "utf8");
                        response.end();
			
			
                    }
                });
      }
      else if(path == '/smoothie.js'){
      s.readFile(__dirname + path, function(error, data){
                    if (error){
                        response.writeHead(404);
                        response.write("opps boy this doesn't exist - 404");
                        response.end();
                    }
                    else{
                        response.writeHead(200, {"Content-Type": "text/html"});
                        response.write(data, "utf8");
                        response.end();
			
			
                    }
                });
      
      }
      else if(path == '/test.html'){
      s.readFile(__dirname + path, function(error, data){
                    if (error){
                        response.writeHead(404);
                        response.write("opps boy this doesn't exist - 404");
                        response.end();
                    }
                    else{
                        response.writeHead(200, {"Content-Type": "text/html"});
                        response.write(data, "utf8");
                        response.end();
			
			
                    }
                });
      }
}).listen(13001);
/*var graph = http.createServer(function(req,resp){
var path = url.parse(req.url).pathname;
var temp;
console.log(path);
if(path == '/'){
temp = path + "test.html";
s.readFile(__dirname + temp,function(err,data){
	if(err){
	resp.writeHead(404);
	resp.write("Oops this is not there-404");
	resp.end();
	}
	else{
	resp.writeHead(200,{"Content-Type":"text/html"});
	resp.write(data,"utf8");
	resp.end();
	}
	});
}
else if(path == '/smoothie.js'){
s.readFile(__dirname + path,function(err,data){
	if(err){
	resp.writeHead(404);
	resp.write("Oops this is not there-404");
	resp.end();
	}
	else{
	resp.writeHead(200,{"Content-Type":"text/html"});
	resp.write(data,"utf8");
	resp.end();
	}
});
}

}).listen(21001);
*/
var listener = io.listen(server);
//var graph_listener = graph_io.listen(graph);
var udp_server = dgram.createSocket('udp4');
var xbee_server = dgram.createSocket('udp4');
var smoke_server = dgram.createSocket('udp4');
var danger_server = dgram.createSocket('udp4');
var feedback_client = dgram.createSocket('udp4');
var pir_server = dgram.createSocket('udp4');
var identity = dgram.createSocket('udp4');
xbee_server.bind(xbee_port);
xbee_server.on('listening',function(){
console.log("Hey there xbee I am waiting.");
});
xbee_server.on('message',function(msg,rem){
console.log("Okay xbee for the msg: "+msg.toString()+"from: "+rem.address.toString());
listener.emit('xbee',{'msg':msg.toString()});
});
chat_client.on('listening',function(){
    console.log("ready for chatting bhai..");
    chat_client.setBroadcast(true);
});
/*var id = setInterval(function(){
var buff = new Buffer("i am server");
chat_client.send(buff,0,buff.length,20001,"255.255.255.255",function(err){
if(err){console.log(err);}
    console.log("Sent hello message");
});
},15000);*/
trigger_set_id = setInterval(function(){
console.log(trigger_param);
if(trigger_param <= 0){
console.log("Please check the gateways becoz I have none of them in my list.");
clearInterval(trigger_set_id);
}

--trigger_param;
},8000);/////////////////today
identity.bind(16001);
smoke_server.bind(smoke_port);
pir_server.bind(pir_port);
danger_server.bind(danger_port);
udp_server.bind(udp_port);
 var nowIamClient = dgram.createSocket('udp4');
nowIamClient.on('message',function(message,remote){
    console.log("Got the list"+message+"from"+remote.address+"on port:" + remote.port);
    node_string = message.toString();
    nodes = node_string.split(",");
});
setInterval(function(){
console.log(trigger_param);
},1000);
identity.on('listening',function(){
console.log("Waiting for gateways..");
identity.setBroadcast(true);
});
smoke_server.on('listening',function(){
console.log("smoke server is waiting..");
});
pir_server.on('listening',function(){
console.log("I am waiting..");
});
feedback_client.on('listening',function(){
console.log("Feedback client ready on" + node_port);
});

danger_server.on('listening',function(){
var server_addr = danger_server.address();
    console.log("Emergency bserver running on:" + server_addr.address + "@ port no." + server_addr.port);
});
udp_server.on('listening',function(){
    var server_addr = udp_server.address();
    console.log("UDp server running on:" + server_addr.address + "@ port no." + server_addr.port);
});
identity.on('message',function(msg,remote){
	var gateway = remote.address.toString();
	var status = msg.toString();
	if(gateways[0].indexOf(gateway) < 0){
		gateways[0].push(gateway);	
	}
	var index = gateways[0].indexOf(gateway);
	gateways[1][index] = status;
////
/*var unnecessary = check_otheractive(gateways);
if(unnecessary.length > 0){
var i = new Buffer("stop taking");
identity.send(i,0,i.length,16001,unnecessary[0],function(err){
if(err){console.log(err);}
console.log("Unnecessary active ones are deactivated");
});
}*/
////
var unnecessary = check_otheractive(gateways);
if(unnecessary.length > 0){
var i = new Buffer("stop taking");
console.log(unnecessary[0]);
identity.send(i,0,i.length,16001,unnecessary[0],function(err){
if(err){console.log(err);}
console.log("Unnecessary active ones are deactivated");
});
}
if(trigger_param < 7){
var indx = gateways[0].indexOf(udp_gateway_ip);
gateways[1][indx] = "off";
var activate = check_active(gateways);
console.log(activate);
var buf = new Buffer("start taking");
identity.send(buf,0,buf.length,16001,activate,function(err){
	if(err){}
console.log("Succesfully activated: "+activate);

});
udp_gateway_ip = activate;
trigger_param = 10;
}

console.log("The gateways are :"+gateways[0]+"and their status: "+gateways[1]);
});
///Selecting the gateway.
function check_otheractive(beta){
var ind = 0;
var result = [];
   for(;ind < beta[0].length;++ind){
     	if(beta[1][ind] == "active"){
		if(beta[0][ind] != udp_gateway_ip){
		    result.push(beta[0][ind]);
		}
	}
  }
return result;
}
function check_dormant(alpha){
	var d_ind = alpha[1].indexOf("dormant");
	var ip = alpha[0][d_ind];
	return ip;
}
function check_active(alpha){
	var d_ind = alpha[1].indexOf("active");
	var ip = alpha[0][d_ind];
	return ip;
}
function start_random(){
var value = Math.random()*1000;
rand_id = setInterval(function(){
listener.emit('take_me',{"values":value});
},500);
}
////{}
if(trigger_param < 0){

}
smoke_server.on('message',function(msg,remote){
++trigger_param;
if(trigger_param > 12){
trigger_param = 10;
}
var smoke_value = msg.toString();
var split = smoke_value.split(",");
var sd = [split[0],split[2]];
var smoke_write = new Date() + ' ' + split[0] + ' '  + split[2] + '\n';
//time + Smoke present/Not present + Room from which
//add the code to add the entries to the collection Smoke.

var smoke_file = file.appendFile("Smoke.log",smoke_write,function(err){
   if(err){
   console.log(err);
   }
    
   console.log("Written Succesfully");
   });
listener.emit('smoking',{'smoke_value':sd});
});
pir_server.on('message',function(msg,remote){
++trigger_param;
if(trigger_param > 12){
trigger_param = 10;
}
++stock_count;
if(stock_count == 59){
//publish_results(stock);
stock_count = 0;
}
var inter = msg.toString();
var spl = inter.split(",");

    //var sd = [spl[0],spl[2]];
    pir_value =  new Date() + ' ' + spl[0] + '  ' + spl[2] + '\n';
   var descriptor = file.appendFile("Motion.log",pir_value,function(err){
   if(err){
   console.log(err);
   }
    
   console.log("Written Succesfully");
   });
listener.emit('motion',{'flag':spl});
});
function publish_results(vads){
var  it=0;
var sum = 0;
for(;it<vads.length;++it){
sum+=vads[it];
}
if(sum >= 55 || sum  < 4){
listener.emit('results',{'myvalue':false});
vads = [];
}
else{
listener.emit('results',{'myvalue':true});
vads = [];
}
}
udp_server.on('message',function(message,client){
    ++trigger_param;
    if(trigger_param > 12){
    trigger_param = 10;
    }
    var str = message.toString();
    var something = str.split("a");
    console.log( something[0] + " from "+something[1] + "@ gateway " + client.address + "on port" + client.port);
    send_string = something[0];
    var values = something[0].split("s");
    var t = values[0];
    var l = values[1];
    //file writing;
    
    console.log("The temp is: "+t);
    console.log("The light is: "+l);
    var hash_ip = something[1].split(',');
    var tl_write = new Date() + ' ' + t + ' ' + l + ' '+ hash_ip[1] + '\n';
    //A little tester function to make sure everything will be working fine.
    //starting from here.
                    (function trial()
                {
                // Use connect method to connect to the Server
                MongoClient.connect(url, function (err, db) {
                if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
                } else {
                var datenow=new Date();
                console.log('Connection established to', url);
                // Get the documents collection
                var collection = db.collection('templight');
                //the values
                var data1 = {date: datenow, temperature:t , light:l, room:hash_ip[1]};
                // Insert some users
                collection.insert([data1], function (err, result) {
                if (err) {
                console.log(err);
                } else {
                console.log("Inserted %d documents into the \"users\" collection. The documents inserted with \"_id\" are:", result.length, result);
                }
                //Close connection
                db.close();
                });
                }
                });
                })();
                //till here is my part
    var tl_file = file.appendFile("TempLight.log",tl_write,function(err){
   if(err){
   console.log(err);
   }
   console.log("Written Succesfully");
   });
    var index = nodes.indexOf(hash_ip[0]);
    var ip = hash_ip[0];
    listener.emit('take_it',{'temp':parseFloat(t),'light':parseFloat(l),'sours':hash_ip[1]});
    //if(index >= 0){
        if(ip == nodes[0]){
        listener.emit('take_values_from_a',{'values':send_string,'ip':hash_ip[0],'name':hash_ip[1]});
        }
        else if(ip == nodes[1]){
         listener.emit('take_values_from_b',{'values':send_string,'ip':hash_ip[0],'name':hash_ip[1]});
        }
        else if(ip == nodes[2]){
        listener.emit('take_values_from_c',{'values':send_string,'ip':hash_ip[0],'name':hash_ip[1]});
        }
   // }
    udp_gateway_ip = client.address;
});
danger_server.on('message',function(message,client){
var str = message.toString();
    console.log(str);
});
//graph listener
/*rand_id = setInterval(function(){
var r = Math.random() * 1000;
graph_listener.emit('take_it',{'rand':r});
listener.emit('take_it',{'rand':r});
},1000);*/
//listener

listener.sockets.on('connection', function(socket){
    var temp_thresh_val = [];
    var light_thresh_val = [];
    // finding the users
    socket.on('gimme_the_users',function(msg){
        socket.emit('take_users',{'users':client_ip});
    });
    
    socket.on('disconnect',function(msg){
        var the_ip = socket.handshake.address;
        var the_port = the_ip.port;
        console.log("The disconnected ip was: "+the_ip+"@"+the_port);
    });
    //
    socket.on('showlog',function(msg){
    socket.emit('takelog',{'log':pir_value});
    pir_value = "";
    });
    socket.on('download signal',function(msg){//event listener for downloading signal
        socket.emit('response',{'log':data,'analog_value':analog,'light_value':light_val,'date':date});
        data = "";
    });
    socket.on('setevent',function(msg){
        var rand = msg.threshold_value;
    console.log("The threshold has been set @ " + rand);          
        temp_thresh_val = [];
        temp_thresh_val.push(rand[0]);
        temp_thresh_val.push(rand[1]);
        socket.emit('take_temp',{'values':temp_thresh_val});
    });
    socket.on('light_thresh_event',function(msg){
         
        
    socket.emit('take_light',{'values':light_thresh_val});
    });
    
    socket.on('showconnectednodes',function(msg){
        perfromTheCollection();
        console.log("See these are the nodes bru:" + nodes);
        socket.emit('received_list',{'connected_nodes':nodes});
    });
   ///if you want to insert the startme and alarm code insert below.the snippet is stored in another file in nathan. 
    socket.on('trigger_a',function(msg){
        var str = msg.ip.toString() +","+msg.kind.toString()+","+msg.msg.toString();
        var buff = new Buffer(str.length);
        buff.write(str);
        
    feedback_client.send(buff,0,buff.length,node_port,udp_gateway_ip,function(err){
    if(err){
    console.log(err);
    }
    });
    });
    socket.on('trigger_b',function(msg){
    var str = msg.ip.toString() +","+msg.kind.toString()+","+msg.msg.toString();
    var buff = new Buffer(str.length);
    buff.write(str);
    feedback_client.send(buff,0,buff.length,node_port,udp_gateway_ip,function(err){
    if(err){
    console.log(err);
    }
    });
    });
    socket.on('trigger_c',function(msg){
    var str = msg.ip.toString() +","+msg.kind.toString()+","+msg.msg.toString();
    var buff = new Buffer(str.length);
    buff.write(str);
    feedback_client.send(buff,0,buff.length,node_port,udp_gateway_ip,function(err){
    if(err){
    console.log(err);
    }
    });
    });
    
});
///temp_calculator
function temp_calculator(temp){
    var a = Math.floor(temp * 100);
    var resistance = (4096-a)*10000/a; //get the resistance of the sensor;
    var temp = 1/(Math.log(resistance/10000)/3975+1/298.15)-273.15;
    return temp;
}
///lux calculator
function lux_calculator(light){
 var light_adc_value = Math.floor(light * 100);
        var light_voltage = (light_adc_value/4096.0)*5;
        var resistance = (10000.0*(5-light_voltage))/light_voltage;
        var lux = (500.0/resistance)*1000;
    return lux;
}
///
function perfromTheCollection(){
    var command = new Buffer("nodelist");
    udp_gateway_port = 12001;
    nowIamClient.send(command,0,command.length,udp_gateway_port,udp_gateway_ip,function(err){
    if(err){
    console.log("error sending command to gateway!!");
    }
    });
};
function splitter(from_gateway){
var temp = "";
temp = from_gateway;
nodes = temp.split(",");   
};
////decrement


console.log('Server running at 13001');
