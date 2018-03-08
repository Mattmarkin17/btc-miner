let cluster = require("cluster"),
    hashrate = {},
    totalhashs = {};

if (cluster.isMaster) {
    const cpus = require("os").cpus().length;

    for(var i = 0; i < cpus; i++) {
        let worker = cluster.fork();

        worker.on('message', function(msg) {
            //console.log('Master ' + process.pid + ' received message from worker ' + this.pid + '.', msg);
            hashrate[worker.process.pid] = msg.hashrate
            totalhashs[worker.process.pid] = msg.total;
        });
    }

    setInterval(function(){
        //console.clear();

        var totalHashrate = 0,
            totalHashs = 0;

        for(let key in hashrate){
            totalHashrate += hashrate[key];
            totalHashs += totalhashs[key];
        }

        if(totalHashrate > 1000000000)
            totalHashrate = (totalHashrate / 1000000000).toFixed(2) + "gh/s"
        else if(totalHashrate > 1000000)
            totalHashrate = (totalHashrate / 1000000).toFixed(2) + "mh/s"
        else if(totalHashrate > 1000)
            totalHashrate = (totalHashrate / 1000).toFixed(2) + "kh/s"
        else
            totalHashrate = totalHashrate.toFixed(2) + "h/s"

        //console.log("Hashrate: " + totalHashrate + "\nTotal de hashs: " + totalHashs.toLocaleString("pt-br"));
        console.log("Hashrate: " + totalHashrate);
    }, 10000);
} else{
    require("./hashrate.js");
}
