exports.db = {
  url: 'mongodb://127.0.0.1/',
  name: 'blog',
  collection: 'users'  // collection name for MongoDB
};
//��½
exports.login = {
  route: '/login',
  // logoutRoute: '/logout',
  views: {
    login: 'user/login.html',
    // loggedOut: 'index.jade'
  }
};