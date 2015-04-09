var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");

var quizMAP = {};

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

//app.use('/', routes);
//app.use('/accion', routes);
//app.use('/users', users);

app.post('/accion', function(req,res){
  console.log('req.body = '+req.body);

  var currentQuestion = req.body.numquestion;
  console.log(currentQuestion);
  var quizID = req.body.quizID;
  
  console.log(quizID);
  console.log(req.body.quizID);

  var resp = '';
  for (var i=0; i<quizMAP[quizID].questions[currentQuestion].answers.length; i++)
    resp += quizMAP[quizID].questions[currentQuestion].answers[i].toString();

  console.log(resp);

  currentQuestion = Math.floor(quizMAP[quizID].questions.length*Math.random());

  var ok = (req.body.response.split('').sort().join('') == resp);

  var return_value = {result: ok, numQuestion: currentQuestion, nextQuestion: quizMAP[quizID].questions[currentQuestion]};
  console.log(return_value);

  res.json(return_value);
});

/* GET home page. */
app.get('/', function(req, res, next) {
  // var currentQuestion = quiz.questions.length-1;
  res.send('Debe digitar https:://quizshow-josecastro-6.c9.io/quiz/materia'); 
});


app.get('/quiz/:quizname', function(request, response, next) {
  var quizName = request.params.quizname;
  console.log('got the right message');
  console.log('trying to load quiz '+quizName);
  if (!quizMAP[quizName]) {
    quizMAP[quizName] = JSON.parse(fs.readFileSync(quizName+'.json'));
  }

  var currentQuestion = quizMAP[quizName].questions.length-1;
  response.render('index.jade',
    { title: 'QuizShow', 
      name: quizMAP[quizName].header, 
      quizID : quizName,
      numQuestion: currentQuestion, 
      quiz: quizMAP[quizName].questions[currentQuestion]});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
