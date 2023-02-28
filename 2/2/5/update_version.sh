#!/usr/bin/env bash

# Script to automatically update genesis version numbers. Updates the following list of files:
#   - package.json (and package-lock.json, via npm install)
#   - src/version.js
#   - any file in scripts/ (recursively)
# and also automatically creates the noah_scripts_vX.Y.Z.zip file in static/downloads/.
#
# This script should be run before committing a version number bump.
#
# Usage:
#
#   ./update_version.sh <NEW_VERSION>
#
# The old version number is read automatically from the output of `git tag`.

# cd to the correct directory
cd $(dirname "$0")

# Get the current version number from git tag
git_vno=$(git for-each-ref --sort=creatordate --format '%(refname)' refs/tags | sed 's:refs/tags/::' | grep "^v[[:digit:]]\{1,\}\.[[:digit:]]\{1,\}\.[[:digit:]]\{1,\}" | tail -n 1 | sed 's/v//')

usage() {
    cat << EOM
Usage:
  $0 <NEW_VERSION>

(The current version number is $git_vno)
EOM
}

git_dirty() {
    cat << EOM
There are uncommitted changes or untracked files present in the working directory.
Please commit or remove these before running this script (as it will automatically
make a new commit for the version number bump).
EOM
}

# Check arguments
if [ "$1" = "-h" ]; then
    usage
    exit 0
elif [ $# -lt 1 ]; then
    usage
    exit 1
elif [ $# -gt 1 ]; then
    usage
    exit 1
fi

# Check if git index or working directory has new stuff
if ! [ -z "$(git status --porcelain=v1 2>/dev/null)" ]; then
    git_dirty
    exit 1
fi

# Escape the dots in version numbers
old_vno=${git_vno//./\\.}
new_vno=$1

# Check version of sed as GNU and BSD versions differ in sed -i behaviour
# Thanks https://stackoverflow.com/a/65497543/7115316
sed --version >/dev/null 2>&1
if [ $? -eq 0 ]; then
    sed_command=("sed" "-i")        # GNU
else
    sed_command=("sed" "-i" "")   # BSD
fi

# Edit top-level JavaScript files
"${sed_command[@]}" "s/${old_vno}/${new_vno}/g" "./package.json"
"${sed_command[@]}" "s/${old_vno}/${new_vno}/g" "./src/version.ts"
npm install

# Edit scripts
# We first get the date by grepping in noah_nus2.py. Note that this regex will fail in the year 2100.
old_date=$(grep "^[[:digit:]]\{1,2\} [[:alpha:]]\{1,\} 20[[:digit:]]\{2\}" scripts/py/noah_nus2.py)
new_date=$(date -u +"%d %B %Y")
# Then we edit the version number and the date.
for fname in scripts/py/*; do
    "${sed_command[@]}" "s/${old_vno}/${new_vno}/g" "$fname"
    "${sed_command[@]}" "s/${old_date}/${new_date}/g" "$fname"
done
for fname in scripts/au/*; do
    "${sed_command[@]}" "s/${old_vno}/${new_vno}/g" "$fname"
    "${sed_command[@]}" "s/${old_date}/${new_date}/g" "$fname"
done

# Create zip file of scripts
long_name="noah_scripts_v${new_vno}"
cp -r scripts ${long_name}
rm static/downloads/*
zip -r "static/downloads/${long_name}.zip" "${long_name}" -x '*.DS_Store*'
rm -r ${long_name}

# git add and commit
git add -A
git commit -m "version: bump to ${new_vno}"
git tag "v${new_vno}"

echo ""
echo "Version numbers updated from v${git_vno} to v${new_vno}."
