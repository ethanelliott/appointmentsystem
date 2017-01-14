var express = require('express');
var crypto = require('crypto');
var mongo = require('mongodb');
var session = require('client-sessions');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var dbApp = req.dbApp.get('appCollection');
  var dbUser = req.dbUser.get('userCollection');
  if (req.session && req.session.user){

  }else {
    var errorString = '';
    switch (req.query.error){
      case '2':	//User has entered incorrect password
        errorString = "Incorrect password / username!";
      break;
      default:
        errorString = "";
      break;
    }
    res.render('index', { title: 'Home', error: errorString});
  }
});

router.get('/register', function(req, res, next) {
  res.render('register', {title: "Register"});
});

router.post('/Ulogin', function(req, res)
{
	var dbUser = req.dbUser.get('userCollection');

	var uName = req.body.uusername;
	var uPass = req.body.upassword;

	var query = dbUser.find({'username':uName}).then(
		function(value)
		{
			if(value[0])
			{
				if (validatePassword(uPass, value[0].password))
				{
					//console.log("WELCOME YOU ARE LOGGED IN!");
					req.session.user = value[0];
					req.session.user.password = "";
					res.redirect("userlist");
				}
				else
				{
					//console.log("YOU ARE NOT LOGGED IN!");
					res.redirect("/?error=2");
				}
			}
			else
			{
				//console.log("ERROR: USER NOT FOUND!")
				res.redirect("/?error=2");
			}

		}
	);
});

router.post('/validateusername', function(req, res)
{

  var dbUser = req.dbUser.get('userCollection');
	var userName = req.body.username;

	var query = dbUser.find({'username':userName}).then(
		function(value)
		{
			if(value[0])
			{
				res.json({ "valid": false, "message":"Username already taken!"});
			}
			else
			{
				res.json({ "valid": true, "message":"Good" });
			}
		}
	);
});

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 31; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
};

var hash = function(str)
{
	return crypto.createHash('sha256').update(str).digest('HEX');
};

var saltAndHash = function(pass)
{
	//"If I salt a password does that make it spicy?"
	var salt = generateSalt();
	return salt + hash(pass + salt) + hash(salt);
};

var validatePassword = function(plainPass, hashedPass)
{
	var salt = hashedPass.substr(0, 31);
	var validHash = salt + hash(plainPass + salt) + hash(salt);
	if (hashedPass === validHash)
	{
		return true;
	}
	else
	{
		return false;
	}
};

module.exports = router;
