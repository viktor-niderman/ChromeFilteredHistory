VERSION=$(jq -r .version "src/manifest.json")
echo 'Current version: '$VERSION

FOLDER='v'$VERSION
NAME='filtered_history_v'$VERSION

rm -rf 'dist'
rm -rf "compiled/$FOLDER"
mkdir "compiled"
mkdir "compiled/$FOLDER"

npm run build
mv 'dist' "compiled/$FOLDER/$NAME"

# shellcheck disable=SC2164
cd "compiled/$FOLDER"
zip -r "$NAME".zip "$NAME"
