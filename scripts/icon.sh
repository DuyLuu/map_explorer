#! /bin/bash

ICON_FONT="src/components/Icon/assets/icomoon.ttf"
DESTINATIONS=(
    "src/assets/fonts/icomoon.ttf" 
    "android/app/src/main/assets/fonts/icomoon.ttf"
)

for f in ${DESTINATIONS[@]}; do
    echo "Copying font to ${f}"
    cp "$(pwd)/$ICON_FONT" "$(pwd)/${f}"
    if [ $? -eq 0 ]; then
        echo "Successfully copied to ${f}"
    else
        echo FAIL
    fi
done
echo "Please reinstall app"
