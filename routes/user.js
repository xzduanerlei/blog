var express = require('express');
var router = express.Router();
var path = require('path');
var privateKey = '36fc3fe98530eea08dfc6ce76e3d24c4';
var publicKey = 'b46d1900d0a894591916ea94ea91bd2c';

var Geetest = require('geetest');

var geetest = new Geetest(privateKey, publicKey);
//登录页面
// router.get('/login', function (req, res, next) {
//     res.render('user/login', {});
// });
// //注册页面
// router.get('/reg', function (req, res, next) {
//     res.render('user/register', {});
// });


router.get("/register", function (req, res) {

	// 向极验申请一次验证所需的challenge
	geetest.register(function (err, data) {
		if (err) {
			res.send(JSON.stringify({
				gt: publicKey,
				success: 0
			}));
		} else {
			res.send(JSON.stringify({
				gt: publicKey,
				challenge: data,
				success: 1
			}));
		}
	});
});

router.post("/validate", function (req, res) {
	// 对ajax提交的验证结果值进行验证
	console.log(req.body);
	geetest.validate({
		challenge: req.body.geetest_challenge,
		validate: req.body.geetest_validate,
		seccode: req.body.geetest_seccode
	}, function (err, result) {

		var data = {status: "success", info: '登录成功'};

		if (err || !result) {
			data.status = "fail";
			data.info = '登录失败';
		}

		res.send(JSON.stringify(data));

	});
});

module.exports = router;