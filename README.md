# Lapse It! 
[![Build Status](https://travis-ci.com/rksiazek/image-processing-server.svg?token=7ugfFzCwMxAbmLp4zBPs&branch=junk/ci)](https://travis-ci.com/rksiazek/image-processing-server) 
![Dependencies](https://david-dm.org/rksiazek/lapseit.svg) 
![Issues](https://img.shields.io/github/issues/rksiazek/lapseit.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

NodeJS based web service application, providing handy solution for generation of timelapses.

## Getting Started

To run this application on your own, just clone this repository and execute the command:
```
npm run start
```

## Running the tests
To execute test procedures, run following command:

```sh
npm test
```


### Coding style tests
Coding style tests ensure that developers keep following good and centralized practices regarding code styling.

```
npm lint
```

## Built With

* [NodeJS](https://nodejs.org/en/) - An asynchronous event driven JavaScript runtime, designed to build scalable network applications
* [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications. 
* [Bull](https://optimalbits.github.io/bull/) - Jobs queuing module powered by [Redis](https://redis.io/) and wrapped by [NestBull](https://github.com/fwoelffel/nest-bull#quick-start) module
* [FluentFFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) - API bridge between server and [FFmpeg](https://ffmpeg.org/) - A complete, cross-platform solution to record, convert and stream audio and video. 

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Radosław Książek** - *Initial work* - [rksiazek](https://github.com/rksiazek)

See also the list of [contributors](https://github.com/rksiazek/lapseit/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Inspired by timelapse generation from remote resources uploaded to the CDN's by IoT devices, such as IP cameras

