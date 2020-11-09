# gennoah

Website that generates pretty much any NOAH pulse programme you might want.
View at https://yongrenjie.github.io/gennoah.

**Warning:** This is a development version of the website. It may have bugs!

-------------------------

**Running the website offline**

Because the website uses ES6 modules, which cannot be served locally, simply opening `index.html` in a browser of choice will not work.
You need to start a HTTP server from the top-level directory, for example using Python:

```
git clone https://github.com/yongrenjie/gennoah   # or download a release
cd gennoah
python -m http.server
```

Python by default uses port 8000. Open up a browser and navigate to `localhost:8000`. It should then work.
