// Managing the poll list
function PollListCtrl($scope,Poll) {
    $scope.polls = Poll.query();
    $scope.delpoll = function(id) {
        var newPoll = new Poll();
        newPoll.$remove({id:id},function(p, resp) {
             $scope.polls = Poll.query();
        });
    };
}
// Voting / viewing poll results
function PollItemCtrl($scope, $routeParams, socket, Poll) {
    $scope.poll = {};
    socket.on('myvote', function(data) {
        console.dir(data);
        if(data._id === $routeParams.pollId) {
          $scope.poll = data;
        }
    });
    socket.on('vote', function(data) {
        console.dir(data);
        if(data._id === $routeParams.pollId) {
          $scope.poll.choices = data.choices;
          $scope.poll.totalVotes = data.totalVotes;
        }   
    });
    $scope.vote = function() {
        var pollId = $scope.poll._id,
            choiceId = $scope.poll.userVote;
        if(choiceId) {
          var voteObj = { poll_id: pollId, choice: choiceId };
          console.log(voteObj)
          socket.emit('send:vote', voteObj);
        } else {
          alert('您必须选择一个选项来投票');
        }
    };
   
    $scope.poll = Poll.get({pollId: $routeParams.pollId});
}
// Creating a new poll
function PollNewCtrl($scope, $location, Poll) {
    $scope.poll = {
        question: '',
        choices: [ { text: '' }, { text: '' }, { text: '' }]
    };  
    $scope.addChoice = function() {
        $scope.poll.choices.push({ text: '' });
    };
    $scope.createPoll = function() {
        var poll = $scope.poll;
        if(poll.question.length > 0) {
            var choiceCount = 0;
            for(var i = 0, ln = poll.choices.length; i < ln; i++) {
                var choice = poll.choices[i];        
                if(choice.text.length > 0) {
                    choiceCount++
                }
            }    
            if(choiceCount > 1) {
                var newPoll = new Poll(poll); 

                newPoll.$save(function(p, resp) {

                    if(!p.error) { 
                        $location.path('polls');
                    } else {
                        alert('无法创建投票');
                    }
                });
            } else {
                alert('您必须输入至少2个选择！');
            }
        } else {
            alert('你必须输入一个问题！');
        }
    };
}