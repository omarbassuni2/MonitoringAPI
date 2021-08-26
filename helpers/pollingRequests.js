const http = require('http');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

dashboard_display = async(cookieValue, res) =>{
    token = cookieValue;
    var check = {};
    var userId = '';
    const decrypt = await jwt.verify(token, ' The very secret key that is both long and secret',
    (err, decodedToken) => {
        if(err){
            console.log('Token verification error!');
        }else{
            userId = decodedToken.id;
        };
    });

    check = {};
    await User.findById(userId).then(function(record){
        check = record.checks;          //loop it in the front end

    });

    var availability, downtime, uptime, responeTime, totalTime = 0;
    var count = 0;
    reportArr = []; 
    var start = new Date();
    var history = new Date(); //timestamp of the creation - before the interval works again
    count += 1;
    for(var i = 0; i < check.length; i++){
        var outages = false;  // number of fail attempts 
        const { statusCode, statusMessage, upStatus }  = await pollingRequest(check[i]); //need to create a non-parameters function to call dashboard_display
        
        var diff = new Date() - start; //add the time of the interval
        if(upStatus){
           uptime = diff; //multiply by 1000 to convert to secs
        }
        else{
            outages = true;
            downtime = diff; //multiply by 1000 to convert to secs
        }
        //totalTime = totalTime + diff;
        //responeTime = (totalTime / count);  //multiply by 1000 to convert to secs
        //availability = (uptime / (uptime+downtime)) * 100;
        var checkName = check[i].name;
        console.log(statusCode[0]);
        reportArr.push({ checkName, statusCode, statusMessage, outages, downtime, uptime, count, history });
        }
        console.log(reportArr);
   // return res.send(reportArr);
};


pollingRequest = async(check) => {
    const { name, url, protocol, path, port,
        webhook, timeout, interval, threshold,
        auth, httpHeaders, assert, tags,ignoreSSL } = check;

    httpOptions = { hostname:url, protocol, path, port,
                    webhook, timeout, threshold, auth, headers: httpHeaders};

    let statusCode = [];
    let statusMessage = [];
    let upStatus = [];
    const new_req = await http.request(httpOptions, (res) => { 
        statusCode.push(res.statusCode);
        statusMessage.push(res.statusMessage);
        if(res.statusCode / 100 !== 5){
            //if the server down send a message that the server is down
            
            upStatus.push(true);
        }
        else{
            //else server is not down 
            upStatus.push(false);
        }
        return statusCode, statusMessage, upStatus
    })

    setTimeout(function () {
    console.log("10 seconds later...", upStatus[0]);
    }, 1000);
    new_req.end();
    return  { statusCode, statusMessage, upStatus } ;
}


module.exports = { dashboard_display };