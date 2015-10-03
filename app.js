
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , signup = require('./routes/signup')
  , login = require('./routes/login')
  , session = require('client-sessions')
  , newsfeed = require('./routes/newsfeed')
  , friend = require('./routes/friend') 
  , bcrypt = require('bcrypt');

var app = express();

// all environments
app.use(session({
	cookieName: 'session',    
	secret: 'socialediaapplicationprototype',    
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,  }));
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
/*app.use(session({
	  secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK' // set this to a long random string!
	}));*/



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/signup', signup.signup);
app.post('/login', login.login);
app.post('/logout', login.logout);
app.get('/home', login.home);
app.post('/getNewsFeeds',newsfeed.getNewsFeed);
app.post('/postStatusUpdate',newsfeed.postStatusUpdate);
app.post('/loadFriendList',friend.loadFriendList);
app.post('/sendFiendRequest',friend.sendFiendRequest);
app.get('/groups', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Social Media Prototype server listening on port ' + app.get('port'));
});
