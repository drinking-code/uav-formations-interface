# Web Interface for the UAV Formation Computation Program

This repository contains the frontend and the web server.
See [here🔗](https://github.com/drinking-code/uav-formations-for-volumetric-displays-from-polygon-meshes) for the
accompanying Python script(s).

## Prerequisites

- Node.js 18 with npm
- An up-to-date browser
- [The repository with the Python script(s)](https://github.com/drinking-code/uav-formations-for-volumetric-displays-from-polygon-meshes)
- Python 3.11
- bpy (instructions at [the other repository](https://github.com/drinking-code/uav-formations-for-volumetric-displays-from-polygon-meshes#prerequisites))

## Getting started

In the other repository, create a venv:

```shell
python3.11 -m venv venv
```

Install the other repository's dependencies (after activating the venv):

```shell
pip install -r requirements.txt
```

In this repository, install the dependencies:

```shell
npm i
```

Build the frontend:

```shell
npm run build
```

Start the server and provide the path to `main.py` of the other repository:

```shell
npm start <path/to/main.py>
```

Your favourite browser should open and navigate to the correct url. If not, manually go to `http://loacalhost:3000`
