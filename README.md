# sym-router

sym-router is a lightweight, client-side routing library that allows you to
create "single page" applications using Hashes or HTML5 pushState. It was
originally forked from [PathJS](https://github.com/mtrpcic/pathjs) but has been
completely rewritten.

```bash
npm install sym-router
```

# Features

* Lightweight
* Supports the HTML5 History API, the 'onhashchange' method, and graceful
  degredation
* Supports root routes, rescue methods, paramaterized routes, optional route
  components (dynamic routes)
* Well Tested (tests available in the `./tests` directory)
* Compatible with all major browsers (Tested on Firefox 25, Chrome 31, IE8, IE10)
* Independant of all third party libraries, but plays nice with all of them

# Using sym-router - A Brief Example

    var Path = require('sym-router');

    function clearPanel(){
        // You can put some code in here to do fancy DOM transitions,
        // such as fade-out or slide-in.
    }

    Path.map("/users").to(function(){
        alert("Users!");
    });

    Path.map("/comments").to(function(){
        alert("Comments!");
    }).exit(clearPanel);

    Path.map("/posts").to(function(){
        alert("Posts!");
    }).exit(clearPanel);

    Path.listen();

# Running Tests

Make sure all dependencies are installed first:

```bash
npm install
```

To run the tests, use `npm test` to test the routing and routes.
For the actual browser history tests, build the JS files with:
`make` and run `python -m SimpleHTTPServer`. Open the html files in
`http://10.0.2.2:8000/tests/browser`. Everything should go to green eventually.

If you're on Windows, just run the commands in the Makefile manually.
