# GENESIS: NMR Supersequence Generation

<p align="center"><img src="https://user-images.githubusercontent.com/22414895/142282732-3dd50a45-e610-46e2-bdc1-ee0c3a5baf36.png" width="450" alt="Fancy figure about GENESIS"></p>

<p align="center">Generate Bruker-format pulse programmes for any NOAH supersequence you might want.</p>

<p align="center"><b>Available now at <a href="https://nmr-genesis.co.uk">https://nmr-genesis.co.uk</a></b></p>

---------

## Online usage

Simply go to https://nmr-genesis.co.uk, select the modules you want to use, and download the resulting pulse programme.
These are ready to use directly on spectrometers.

If you require instructions on how to set up, run, and process NOAH experiments, the website contains a very extensive FAQ.

To access a specific version of the website (say version X.Y.Z), navigate to the URL https://nmr-genesis.co.uk/X/Y/Z.

## Offline usage

1. [Download and install Node.js](https://nodejs.org/en/).
2. Clone this repository and navigate into it..

       git clone https://github.com/yongrenjie/genesis
       cd genesis

3. Run the following commands

       npm install
       npm start

4. Open any web browser and navigate to http://localhost:5555/. (Port 5555 is used by default. If you want to change this, set the `$PORT` environment variable to a number of your choice.)

5. (optional) If you want to access a specific version, run

       git checkout vX.Y.Z

   and then perform steps 3 and 4 again. You can see the full list of versions using the command `git tag`.

## What does GENESIS stand for?

GENEration of Supersequences In Silico.

## What are NOAH experiments?

Check out the original paper:

Kupče, Ē.; Claridge, T. D. W. NOAH: NMR Supersequences for Small Molecule Analysis and Structure Elucidation. *Angew. Chem. Int. Ed.* **2017,** *56* (39), 11779–11783. DOI: [10.1002/anie.201705506](https://doi.org/10.1002/anie.201705506).
