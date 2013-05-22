var request = require('request')
	, couchbase = require("couchbase");

// Source server
var source_config = {
        server: "http://YOUR_SOURCE_IP:8092/",
        bucket: "Events"
};

// Destination server
var dest_config = {
  "debug" : true,
  "hosts": ["localhost:8091"],
  "user": 'Administrator',
  "password": 'YOUR_PASSWORD',
  "bucket" : 'YOUR_BUCKET'
};

function processData(data, cb){
        for(aRow in data.rows){
                cb.set(data.rows[aRow]['doc']['meta']['id'], JSON.stringify(data.rows[aRow]['doc']['json']), function(err, res){
                        if(err){
                                console.error("ERROR ======>");
                                console.error(res);
                        }else{
                                console.info(res);
                        }
                });
        }
}


function getData(cb){
        var cb = cb;
        request.get(source_config.server+source_config.bucket+"/_all_docs?include_docs=true", function(error, response, body) {
                if (error) throw error;
                var data = JSON.parse(body);
                processData( data, cb );
        });
}


couchbase.connect(dest_config, function( err, res ){
        if(err) throw err;
        getData(res);
});
