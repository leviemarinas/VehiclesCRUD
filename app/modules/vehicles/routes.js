/**
 * We load the ExpressJS module.
 * More than just a mere framework, it is also a complementary library
 * to itself.
 */
var express = require('express');

/**
 * Having that in mind, this is one of its robust feature, the Router.
 * You'll appreciate this when we hit RESTful API programming.
 * 
 * For more info, read this: https://expressjs.com/en/4x/api.html#router
 */
var router = express.Router();

/**
 * Import the database module that is located in the lib directory, under app.
 */
var db = require('../../lib/database')();

/**
 * If you can notice, there's nothing new here except we're declaring the
 * route using the router, and not using app.use().
 */
router.get('/', (req, res) => {
    /**
     * This is a TEMPORARY checker if you want to enable the database part of
     * the app or not. In the .env file, there should be an ENABLE_DATABASE field
     * there that should either be 'true' or 'false'.
     */
    if (typeof process.env.ENABLE_DATABASE !== 'undefined' && process.env.ENABLE_DATABASE === 'false') {
        /**
         * If the database part is disabled, then pass a blank array to the
         * render function.
         */
        return render([]);
    }

    /**
     * If the database part is enabled, then use the database module to query
     * from the database specified in your .env file.
     */
    db.query('SELECT * FROM tblcars', function (err, results, fields) {
        /**
         * Temporarily, if there are errors, send the error as is.
         */
        if (err) return res.send(err);

        /**
         * If there are no errors, pass the results (which is an array) to the
         * render function.
         */
        render(results);
    });

    function render(cars) {
        res.render('home/views/index', { cars: cars });
    }   
});
router.get('/add',(req,res) =>{
    res.render('vehicles/views/add');
});
router.post('/add',(req,res) =>{
    const db = require('../../lib/database')();
    db.query(`INSERT INTO tblcars (strMake,strModel,strYear,strPN,strCondition)
     VALUES (\'${req.body.strMake}\',\'${req.body.strModel}\',\'${req.body.strYear}\',
     \'${req.body.strPN}\',\'${req.body.strCondition}\') `,(err,results,fields) =>{
        if(err) console.log(err)
            res.redirect('/index');
     });
});

router.get('/search',(req,res) =>{
    res.render('vehicles/views/index');
});
router.post('/search' ,(req,res) => {
    const db = require('../../lib/database')();
    db.query(`SELECT * FROM tblcars WHERE intID = ${req.body.intID}`,function (err, results,fields){
         if (err) return res.send(err);
         give(results);
    });
    function give(cars) {
        res.render('vehicles/views/showcase', { cars: cars });
    } 
    
});
router.get('/update',(req,res) => {
    res.render('vehicles/views/update')
});
router.post('/update',(req,res) => {
    const db = require('../../lib/database')();
    db.query(`UPDATE tblcars SET strMake = \'${req.body.strMake}\',strModel = \'${req.body.strModel}\'
    ,strYear = \'${req.body.strYear}\' ,strPN = \'${req.body.strPN}\',strCondition = \'${req.body.strCondition}\'
    WHERE intID = ${req.body.intID}`,(err,results,fields) =>{
        if(err) console.log(err);
        res.redirect('/index');
    });
});

router.get('/delete',(req,res) =>{
    res.render('vehicles/views/delete');
});

router.post('/delete',(req,res) => {
    const db = require('../../lib/database')();
     db.query(`DELETE FROM tblcars WHERE intID = ${req.body.intID}`,function (err, results,fields){
         if (err) return res.send(err);
         res.redirect('/index');
    });
});




/**
 * Here we just export said router on the 'index' property of this module.
 */
exports.index = router;