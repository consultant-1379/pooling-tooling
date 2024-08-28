#!/bin/bash

version=$(sed -n 1p ./VERSION)

prod_path='./services/angular/src/environments/environment.prod.ts'
sandbox_path='./services/angular/src/environments/environment.sandbox.ts'
docker_path='./services/angular/src/environments/environment.docker.ts'
precode_path='./services/angular/src/environments/environment.precode.ts'
path='./services/angular/src/environments/environment.ts'

sed -i "s/version.*/version: '$version'/" $path $docker_path $sandbox_path $prod_path $precode_path