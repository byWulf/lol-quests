# lol-quests.byWulf
This app provides individual quests based on a summoners champion masteries. The idea is improving a summoners skill and experience by giving him tips based on his current experience and play style.

It was builded for the Riot API Challenge 2016.

You'll find a working demo here: [www.lol-quests.com](http://www.lol-quests.com)

![Screenshot of lol-quests.byWulf](http://www.lol-quests.com/screenshot.png)

## Table of Contents
- [Idea and objectives](#ideaAndObjectives)
- [Installation](#installation)
    - [On local environmen](#devInstallation)
    - [On production environment](#prodInstallation)
    - [Updating static data](#updateStaticData)
- [Unit tests](#unitTests)
- [Used technologies](#technologies)
    - [MeteorJS](#meteorjs)
    - [Test driven development](#tdd)
    - [PhpStorm](#phpstorm)
- [Lessions learned](#lessionsLearned)


## <a name="ideaAndObjectives"></a>Idea and objectives
As I first saw the returned champion masteries data from the API, I thought about how this data could be useful for summoners. Especially the returned `lastPlayTime` and `highestGrade` brought me to the idea of building a quest system individually generated for the current summoner.

So I brainstormed a few days thinking about what quests could be useful and fun to do and if there are enough ideas for quests, so it won't get boring.

After answering that with a "yes", I made a list of objectives I wanted to archive with this project.
* Personally generated quests individually created for the current summoner
* Helpful and useful for summoners to become better
* Responsive design, so the website is also usable on mobile phones and tables
* Intuitive and easy to use app
* Easy to create/add new quests programmatically

While coding I first didn't build the possibility to cancel quests, because there is no authenticating and everyone could cancel the current quest of someone else. I then decided to implement a cancel button for better demonstration of the app and the generated quests especially for the API challenge review. Later I would love to see a OAuth system for summoners, but currently that is not existing and would need to do some hack to deny other summoners to cancel your quests.

For a list of the implemented quests, see the [about page](http://www.lol-quests.com/about).

## <a name="installation"></a>Installation
### <a name="devInstallation"></a>On local environment
Prerequisites:
* Get a [Riot API key](https://developer.riotgames.com/).
* Install [MeteorJS](https://www.meteor.com/install) on your system.
* Install [git](https://git-scm.com/) on your system.

Save your Riot API key into an environment variable called `LOLQUESTS_APIKEY` (see how for [Windows](http://superuser.com/a/949577/95474), [Linux](https://help.ubuntu.com/community/EnvironmentVariables), [OS X](http://stackoverflow.com/a/3756686/624638)).

Clone this repository with `git clone https://github.com/byWulf/lol-quests.git` into you wished directory and enter that directory.

Pull the needed npm packages by running `meteor npm install`.

Start the server by running `meteor` and wait for the server starting up. At the end, you should see a message like `=> App running at: http://localhost:3000/`.

You're done. Open the browser and visit the named url for using the app.

### <a name="prodInstallation"></a>On production environment
Prerequisites:
* Set up a [local environment](#devInstallation).
* Install [NodeJS](https://nodejs.org/en/download/package-manager/) 0.10.40 or newer on the production system.
* If not automatically installed, install [npm](https://docs.npmjs.com/getting-started/installing-node).
* Install [MongoDB](https://docs.mongodb.com/manual/installation/) (don't forget to secure it).

Go into the repository directory on your local environment.

Create a compiled server package by running `meteor build .bin`. If you are targetting another system architecture than the one you are compiling at, you should consider using the `--architecture` parameter. See `meteor help build` for more information.

Upload the created `*.tar.gz` (it's in your `.bin` directory) to your production server and extract it by running `tar -zxf YOUR_FILE.tar.gz -C /var/www/` (you can choose any directory you want).

Go into that directory followed by `bundle/programs/server/` and run `npm install` to set up the required packages.

Start the server by adjusting and running the following script (I saved it under `~/start.sh` for easier access):
```
#!/bin/sh

export BIND_IP=127.0.0.1
export PORT=80
export MONGO_URL=mongodb://localhost:27017/lol-quests
export ROOT_URL=https://your_domain_for_lol_quests.com
export LOLQUESTS_APIKEY=YOUR_API_KEY_GOES_HERE
node /var/www/bundle/main.js
```

Optional: If you want, you can register it as a service (for doing stuff like `service lol_quests restart`) and setting up supervisor to automatically restart of the server if it crashes.

### <a name="updateStaticData"></a>Updating static data
As soon as you start the server the first time, the static data needed for displaying champion names etc. is automatically pulled from the API and stored in the database. It is also pulled at server start when the already cached data is older than 1 day.

If you want to update the static data (because of a patch or something else), you can do the following steps without having to take the server offline:
* Open up your app in the browser
* Press F12 for the developer toolbar
* Choose "Console" tab
* Enter the following code (replace the API placeholder with your API key used on the server) and press return:
```
Meteor.call('updateStaticData', 'YOUR_API_KEY_GOES_HERE', function(err, data) { if(err) console.error(err); else console.info('Finished!', data); });
```
* Wait for the "Finished!" success message
* You're done :)

## <a name="unitTests"></a>Unit tests
For the core methods of the project specs were written to see if the app is still working after changes. They are implemented with the framework `mocha`.

You can run the tests by running the following command on your local environment:
```
meteor test --driver-package practicalmeteor:mocha
```
After starting open your browser and navigate to the outputtet url. The client- and server-side tests will be run and the result is displayed.

## <a name="technologies"></a>Used technologies
### <a name="meteorjs"></a>MeteorJS
As a base framework for the webserver I decided to use MeteorJS.

It is a reactive programming framework, so it is much easier to handle the display of data which changes in the background.

It uses NodeJS, so the code language for the server and for the client is both Javascript.

As a database it uses MongoDB, a NoSQL database system.

I then use the GitHub project [LeagueJS](https://github.com/byWulf/LeagueJS) (I forked it from [claudiowilson](https://github.com/claudiowilson/LeagueJS) and implemented the missing champion mastery API endpoints). This package is a middleware to call the Riot API with easy to use functions and without having to handle errors etc.
### <a name="tdd"></a>Test driven development
TDD is a programming paradigm for coding in better quality and for being sure that it works.

You write tests for most parts of the project and get feedback on every change you make. That way you know your code is still working, even after big changes.

That way you can refactor parts without the fear of breaking something.

### <a name="phpstorm"></a>PhpStorm
I use PhpStorm for coding this project. The IDEA family is the most used and in my opinion best IDE currently on the marked.

It features code completion, massive refactoring functions, error highlighting and so on.

For this project I could have used WebStorm also, but as I am mainly a PHP coder with a love for NodeJS I have this IDE installed and configured perfectly for my needs.

## <a name="lessionsLearned"></a>Lessions learned
With every project I create I learn new things and experiences, learn from problems or curious JS phenomens. This project tought me these points:
* First documentation completely in English: Documentation is important, but before this project I had always written them in German. English is the most understood language in the world and so a documentation in english makes it accessible to many more people. Even when my English is not "the yellow from the egg" yet, this documentation helped me writing English more fluent than before.
* Second project with MeteorJS: As I first heard from MeteorJS, I was stunned from the possibilities of reactive programming. Before this project I only made one other project ([lol-bravery](http://www.lol-bravery.com)) in MeteorJS, made there a few mistakes and had the opportunity to make it better this time in this project. I learnd so many new things about MeteorJS in this project that is helped me getting better very much.
* Unit tests: Before this project I never wrote unit tests. I am learning them currently at work and wanted to try out TDD in this project. I have to say: How could I code the last decade without writing tests? It makes coding and solving problems so much easier. You have to test less by yourself and have more time to concentrate on the idea you want to realise. I will use unit tests in every project I start from now on.
* Champion masteries: While testing my app with different summoners I know (friend but also Challanger summoners), I noticed, that I really, REALLY have only few champion masteries and too less playing experience. I will definitly personally use this app to improve myself at League of Legends.
* Better understanding of the API: Of course with every project using the Riot API I get more experience in using it and what its possibilities are.