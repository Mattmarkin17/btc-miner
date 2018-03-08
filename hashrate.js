var util = require("./util.js"),
    crypto = require("crypto");

var Hashes = 0;
var StartTime = new Date().getTime() / 1000;

var data = "0000000109a78d37203813d08b45854d51470fcdb588d6dfabbe946e92ad207e0000000038a8ae02f7471575aa120d0c85a10c886a1398ad821fadf5124c37200cb677854e0603871d07fff800000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000080020000"
data = util.fromPoolString(data.substr(128, 256), false);
var nonce = Math.floor(Math.random() * 0xFFFFFFFF);

//00000000ffff0000000000000000000000000000000000000000000000000000
//0000000000000000000000000000000000000000000000000000f8ff07000000
var target = "00000000ffff0000000000000000000000000000000000000000000000000000";
target = util.fromPoolString(target, false);

do{
    data[3] = nonce;

    var sha256 = crypto.createHash('sha256');
    sha256.update(new Buffer(data));
    var hash = sha256.digest("hex");
    Hashes++;

    //console.log(hash[7], hash, target);

    if (hash[7] == 0x00000000) {
        var u1 = util.ToUInt32(hash[6]);
        var u2 = util.ToUInt32(target[6]);

        if(u1 <= u2)
            console("Found:", nonce, hash);
        else
            console.log(hash, target);
    }

    if(Hashes % 100000 == 0){
        var now = new Date().getTime() / 1000;

        if(typeof process.send == "function"){
            process.send({hashrate: (Hashes / (now - StartTime) ), total: Hashes, timestamp: (now - StartTime)});
        }
        else{
            var Hasherate = Hashes / (now - StartTime);

            if(Hasherate > 1000000000)
                Hasherate = (Hasherate / 1000000000).toFixed(2) + "gh/s"
            else if(Hasherate > 1000000)
                Hasherate = (Hasherate / 1000000).toFixed(2) + "mh/s"
            else if(Hasherate > 1000)
                Hasherate = (Hasherate / 1000).toFixed(2) + "kh/s"
            else
                Hasherate = totalHashrate.toFixed(2) + "h/s"

            console.log(Hashes.toLocaleString("pt-br"), Hasherate);
        }
    }
} while(true);
