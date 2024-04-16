import paytmchecksum from '../paytm/PaytmChecksum.js';
import { paytmParams, paytmMerchantKey } from '../index.js';
//import PaytmChecksum from '../paytm/PaytmChecksum.js';

//import formidable, {errors as formidableErrors} from 'formidable';
import formidable from 'formidable';
//import * as formidable from 'formidable';
import https from 'https';



export const addPaymentGateway = async (request, response) => {
    try {
        let paytmCheckSum = await paytmchecksum.generateSignature(paytmParams, paytmMerchantKey);

        let params = {
            ...paytmParams, 'CHECKSUMHASH': paytmCheckSum
        }

        response.status(200).json(params);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}

export const paytmResponse = (request, response) => {
    //const formidable = require('formidable');
    // const form = new formidable.IncomingForm();

    try {
        let paytmCheckSum = request.body.CHECKSUMHASH;
        delete request.body.CHECKSUMHASH;

        let isVerifySignature = paytmchecksum.verifySignature(request.body, paytmMerchantKey, paytmCheckSum);
        if (isVerifySignature) {
            let paytmParams = {};
            paytmParams['MID'] = request.body.MID;
            paytmParams['ORDERID'] = request.body.ORDERID;

            paytmchecksum.generateSignature(paytmParams, paytmMerchantKey).then(function (checksum) {
                paytmParams['CHECKSUMHASH'] = checksum;

                let post_data = JSON.stringify(paytmParams);

                let options = {
                    hostname: 'securegw-stage.paytm.in',
                    port: 443,
                    path: '/order/status',
                    //method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                }

                let res = "";
                let post_req = https.request(options, function (post_res) {
                    post_res.on('data', function (chunk) {
                        res += chunk;
                    });

                    post_res.on('end', function () {
                        let result = JSON.parse(res);
                        //console.log(result);
                        response.redirect('http://localhost:3000/')
                    })
                });

                post_req.write(post_data);
                post_req.end();

            })
        } else {
            console.log('Checksum Mismatched');
        }
    } catch (e) {
        console.log("Error :" + e);
    }
}

/*

export const paytmResponse = (request, response) => {
   
   // const form = new formidable.IncomingForm();

   try {
    let paytmCheckSum = request.body.CHECKSUMHASH;
    delete request.body.CHECKSUMHASH;

    let isVerifySignature = paytmchecksum.verifySignature(request.body, paytmMerchantKey, paytmCheckSum);
    if (isVerifySignature) {
        let paytmParams = {};
        paytmParams['MID'] = request.body.MID;
        paytmParams['ORDER_ID'] = request.body.ORDER_ID; // order_id

        paytmchecksum.generateSignature(paytmParams, paytmMerchantKey).then(function(checksum) {
            paytmParams['CHECKSUMHASH'] = checksum;

            let post_data = JSON.stringify(paytmParams);

            let options = {
                hostname: 'securegw-stage.paytm.in',
                port: 443,
                path: '/order/status',
                //method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            }

            let res = "";
            let post_req = https.request(options, function(post_res) {
                post_res.on('data', function(chunk) {
                    res += chunk;
                });

                post_res.on('end', function() {
                    let result = JSON.parse(res);
                    //console.log(result);
                    response.redirect('http://localhost:3000/')
                })
            });

            post_req.write(post_data);
            post_req.end();

        })
    } else {
        console.log('Checksum mismatched');
    }
   }
  catch(error){
    response.status(500).json({ error: error.message });
 }
}
*/
