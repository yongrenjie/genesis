# gennoah

Website that generates pretty much any NOAH pulse programme you might want.
View at https://yongrenjie.github.io/gennoah.

**Warning:** This is a development version of the website. It may have bugs!

-------------------------

**Running the website offline**

Because the website uses ES6 modules, which cannot be served locally, simply opening `index.html` in a browser of choice will not work.
(See [this question on Stack Overflow](https://stackoverflow.com/questions/46992463).) for more info.)
Instead, you need to start a HTTP server from the top-level directory.
The MDN web docs have [some useful instructions](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server).
The easiest way is probably using Python 3:

```
git clone https://github.com/yongrenjie/gennoah   # or download a release
cd gennoah
python -m http.server
```

Python by default uses port 8000. Open up a browser and navigate to `localhost:8000`. It should then work.
