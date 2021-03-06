# gennoah

A web app to generate pretty much any NOAH pulse sequence you might want.

**Warning:** This is a development version of the website. It may have bugs!

-------------------------

**Using the website**

The website consists of two parts:

 - an interactive website where you can select modules and download the resulting pulse programme
 - an API which allows programmatic downloading of pulse programmes

The first can always be accessed at https://yongrenjie.github.io/gennoah.

The second relies on a (simple) Node.js server (which cannot be run on GitHub Pages).
To get this to work, first [install Node.js](https://nodejs.org/en/download/), then do the following:

```
git clone https://github.com/yongrenjie/gennoah   # or download a release
cd gennoah
node ./build/app.js
```

Open up a browser and navigate to `localhost` (the website is served on the default port 80).
This is the interactive website (it works in exactly the same way as on GitHub Pages).
To download a pulse programme, first find the desired "backend module names" corresponding to the modules you are interested in.
(This is currently undocumented; I will write it up soon. One quick way to get this is to go onto the interactive website, select the modules you want, then read the *second-last* line of the generated pulse sequence.)
Let's say you want a typical BSC sequence: the backend module names for these are

```
C_HMBC_CF, C_HSQC, H_COSY
```

If you then point your browser to

```
localhost/download?modules=C_HMBC_CF+C_HSQC+H_COSY
```

you should then get the BSC pulse sequence as a response.
