var express = require('express');
var router = express.Router();
var path = require('path');
var async = require('async');
var tool = require('../utility/tool');
var path = require('path');
/* GET home page. */


router.get('/index/*', function(req, res, next) {
   async.parallel([

    ], function (err, results) {
        if (err) {
            next(err);
        } else {

            var url = req.originalUrl.substr(1,req.originalUrl.length);
            var url = url.replace(".html","");
            var paths = path.join(__dirname, "../node_modules/");
            res.render(url, { node_path: paths });
        }
    })
});

// router.get('/', function(req, res, next) {
//    async.parallel([
//         //获取配置
//         // function (cb) {
//         //     // tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
//         //     //     if (err) {
//         //     //         cb(err);
//         //     //     } else {
//         //     //         cb(null, settings);
//         //     //     }
//         //     // });
   
//         // }
//     ], function (err, results) {
//      if (err) {
//             next(err);
//         } else {
//             var settings = results[0];
//          res.render('index', { settings: settings });
//         }
//      })
// });

module.exports = router;
