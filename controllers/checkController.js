const http = require('http');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { dashboard_display } = require('../helpers/pollingRequests');


module.exports.status_get = (req, res, next) => {
    console.log('successful!');
    return res.redirect('/');
};

module.exports.addcheck_get = (req, res) => {
    return res.render('./addcheck');
};

module.exports.addcheck_post = async (req, res) => {
    const token = req.cookies.jwt;
    const check = req.body;
    /*
    check = { name, url, protocol, path, port,
        webhook, timeout, interval, threshold,
        auth, httpHeaders, assert, tags,ignoreSSL };*/

    const decrypt = await jwt.verify(token, ' The very secret key that is both long and secret',
    (err, decodedToken) => {
        if(err){
            console.log('Token verification error!');
        }else{
            //console.log(decodedToken);
            User.findById(decodedToken.id).then(function(record){
                record.checks.push( check );
                record.save();
                console.log('New check created for Id: ', decodedToken.id);
            });
        }
    })
    


    
};

/*function dashboard_display(req){
     const { name,
            url,
            protocol,
            path,
            port,
            webhook,
            timeout,
            interval,
            threshold,
            auth,
            httpHeaders,
            assert,
            tags,
            ignoreSSL } = req.body;
    options = req.body;

    var status = true;  
    const options = {
        hostname: url,
        port,
        protocol,
        path,
        timeout,
        auth,
        headers: httpHeaders,
    };
    
    const new_req = http.request(options, (res) => { 
        console.log('Status Message: ', res.statusMessage);
        if(res.statusCode / 100 !== 5){
            //if the server down send a message that the server is down
            status = false;
        }
        else{
            //else server is not down 
            status = true;
        }
    });
    new_req.on('error', function(err) {
        console.log(err);
    });
    new_req.end();
    //console.log(new_req);

    return status
}
*/


module.exports.dashboard_get = (req, res) => {
    //dashboard_display(req)
    //const cookieValue = JSON.stringify(req.cookies.jwt);
    return res.render('dashboard', {cookieValue: req.cookies.jwt});
};

module.exports.report_get = (req, res) => {
    var numericalReport = dashboard_display(req.cookies.jwt, res);
    return res.send(numericalReport);
};