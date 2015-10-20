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
, user = require('./routes/user')
, groups = require('./routes/groups')
, bcrypt = require('bcrypt');

var app = express();

//Setting up the Cookie properties
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

//Exposing the public folder to be accessed
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + "/public"));

//development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/home', login.home);
app.get('/groups', groups.groups);
app.get('/friendslist', friend.friendslist);
app.get('/userdetails', user.userdetails);
app.get('/login', login.login);

//Group Details Pages
app.get('/navToGroupDetailPage?:groupid', groups.navToGroupDetailPage);
app.get('/groupDetailPage', groups.groupDetailPage);
app.get('/getGroupDetails',groups.getGroupDetails);
app.get('/getGroupUserList',groups.getGroupUserList);
app.get('/getGroupNonMembers',groups.getGroupNonMembers);
app.post('/removeUserFromGroupAdmin',groups.removeUserFromGroupAdmin);
app.post('/addUserToGroupAdmin',groups.addUserToGroupAdmin);
app.post('/deleteGroup',groups.deleteGroup);

//Friend Details Pages
app.get('/navToFriendDetailPage?:friendid', friend.navToFriendDetailPage);
app.post('/getFriendDetails',friend.getFriendDetails);
app.post('/signup', signup.signup);
app.post('/getLifeEvents',user.getLifeEvents);
app.post('/login', login.login);
app.post('/logout', login.logout);
app.post('/getNewsFeeds',newsfeed.getNewsFeed);
app.post('/postStatusUpdate',newsfeed.postStatusUpdate);
app.post('/loadFriendList',friend.loadFriendList);
app.post('/loadMyFriendList',friend.loadMyFriendList);
app.post('/loadPendingFriendList',friend.loadPendingFriendList);
app.post('/acceptFriendRequest',friend.acceptFriendRequest);
app.post('/rejectFriendRequest',friend.rejectFriendRequest);
app.post('/sendFiendRequest',friend.sendFiendRequest);
app.post('/unFriendUserRequest',friend.unFriendUserRequest);
app.post('/uploadProfilePic',user.uploadProfilePic);
app.post('/loadAllGroups',groups.loadAllGroups);
app.post('/loadMyGroups',groups.loadMyGroups);
app.post('/addUserToGroup',groups.addUserToGroup);
app.post('/removeUserFromGroup',groups.removeUserFromGroup);
app.post('/createGroup',groups.createGroup);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Social Media Prototype server listening on port ' + app.get('port'));
});
