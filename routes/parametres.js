var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var solver=require('./module');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.post('/parametres', function(req, res) {
    //solveData.unshift(req.body);
    var resOmj=solver.rootQuadraticEqua(req.body);
    res.json(resOmj);
});

module.exports = router;