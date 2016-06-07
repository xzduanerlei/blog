var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'pollsapp');
var PollSchema = require('../models/Poll.js').PollSchema;
var Poll = db.model('polls', PollSchema);
exports.vote = function(socket) {
    socket.on('send:vote', function(data) {
        var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;    
        Poll.findById(data.poll_id, function(err, poll) {
            var choice = poll.choices.id(data.choice);
            choice.votes.push({ ip: ip });      
            poll.save(function(err, doc) {
                var theDoc = { 
                question: doc.question, _id: doc._id, choices: doc.choices, 
                userVoted: false, totalVotes: 0 
            };
            for(var i = 0, ln = doc.choices.length; i < ln; i++) {
                var choice = doc.choices[i]; 
                for(var j = 0, jLn = choice.votes.length; j < jLn; j++) {
                    var vote = choice.votes[j];
                    theDoc.totalVotes++;
                    theDoc.ip = ip;
                    if(vote.ip === ip) {
                        theDoc.userVoted = true;
                        theDoc.userChoice = { _id: choice._id, text: choice.text };
                    }
                }
            }       
            socket.emit('myvote', theDoc);
            socket.broadcast.emit('vote', theDoc);
            });     
        });
    });
};