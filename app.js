var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000 );
app.set('view engine', 'ejs');
app.set('views', './views');


app.use(express.static('./public'));
app.use(require('./routes/index'));
app.use(require('./routes/parametres'));

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});