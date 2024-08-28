#!/bin/sh

generate_nyc_report() {
  echo "*********************************************"
  echo "*    Angular : Generating Analysis Report   *"
  echo "*********************************************"
  echo -e "\n"
  cp -r /usr/src/app/out/.nyc_output /user/source/app &&
  npx nyc report --reporter=lcov
  if [ "$?" -ne 0 ]; then
      echo "=================================================="
      echo "ERROR : The angular report generation has failed  "
      echo "=================================================="
      exit 1
  else
      echo "==================================================="
      echo "SUCCESS : Angular report generation was successful "
      echo "==================================================="
  fi
}

########################
#     SCRIPT START     #
########################
generate_nyc_report
