var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'pollsapp');
var PollSchema = require('../models/Poll.js').PollSchema;
var Poll = db.model('polls', PollSchema);

router.get('/', function(req, res, next) {
    res.render('angular', {title:"angular"});
});
//投票列表
router.get('/polls/polls', function(req, res, next) {
    Poll.find({}, 'question', function(error, polls) {
        res.json(polls);
    });
});
//投票详细页
router.get('/polls/:id', function(req, res, next) {
    var pollId = req.params.id;
    Poll.findById(pollId, '', { lean: true }, function(err, poll) {
        if(poll) {
            var userVoted = false,
            userChoice,
            totalVotes = 0;
            for(c in poll.choices) {
                var choice = poll.choices[c]; 
                for(v in choice.votes) {
                    var vote = choice.votes[v];
                    totalVotes++;
                    if(vote.ip === (req.header('x-forwarded-for') || req.ip)) {
                        userVoted = true;
                        userChoice = { _id: choice._id, text: choice.text };
                    }
                }
            }
            poll.userVoted = userVoted;
            poll.userChoice = userChoice;
            poll.totalVotes = totalVotes;
            res.json(poll);
        } else {
            res.json({error:true});
        }
    });
});

//新建投票
router.post('/polls', function(req, res, next) {
    var reqBody = req.body,
    choices = reqBody.choices.filter(function(v) { return v.text != ''; }),
    pollObj = {question: reqBody.question, choices: choices};
    var poll = new Poll(pollObj);
    poll.save(function(err, doc) {
        if(err || !doc) {
            var data ={done:false,msg:"保存失败！"};
            res.json(doc);
        } else {
            var data ={done:true,msg:"保存成功！"};
            res.json(doc);
        }   
    });
});
//删除投票
router.delete('/polls', function(req, res, next) {
    var pollId = req.query.id;
    var poll = new Poll();
    Poll.remove({_id:pollId},function(err,doc){  
         if(err || !doc) {
            var data ={done:false,msg:"删除失败！"}
            res.json(data);
        } else {
            var data ={done:true,msg:"删除成功！"}
            res.json(data);
        }   
    });
});

module.exports = router;