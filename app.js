const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

//express app
const app = express();

// connect to mongodb
const dbURI = 'mongodb+srv://netninja:SDEV255@nodetutscluster.o0leayf.mongodb.net/nodetutscluster';
//mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

//register view engine
app.set('view engine', 'ejs');

//listen for requests
//app.listen(3000);

//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));

//app.use((req, res, next) => {
    //console.log('new request made: ');
    //console.log('host: ', req.hostname);
    //console.log('path: ', req.path);
   // console.log('method: ', req.method);
    //next();
//});

//app.use((req, res, next) => {
    //console.log('in the next middleware'); 
    //next();
//});

//mongoose and mongo sandbox routes
/*
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'new blog 2',
        snippet: 'about my new blog',
        body: 'more about my new blog'
    });

    blog.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/all-blogs', (req, res) => {
    Blog.find()
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/single-blog', (req, res) => {
    Blog.findById("668db124595c9ea6338704f4")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        });
})
*/

//routes

app.get('/', (req, res) => {
  /*  const blogs = [
        {title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur'},
        {title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur'},
        {title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur'},

    ];

    res.render('index.ejs', { title: 'Home', blogs});*/
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about.ejs', { title: 'About'});
});

//blog routes

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result })
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.render('details', { blog: result, title: 'Blog Details' });
        })
        .catch(err => {
            console.log(err);
        });
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/blogs' });         
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/blogs/create', (req, res) => {
    res.render('create.ejs', { title: 'Create a new blog'});
});

app.get('/about-us', (req, res) => {
    res.redirect('/about');

});

//404 page
app.use((req, res) => {
    res.status(404).render('404.ejs', { title: '404'});
})