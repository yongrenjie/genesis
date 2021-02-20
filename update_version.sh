#!/usr/bin/env bash

# Script to automatically update gennoah version numbers. Updates the following list of files:
#   - package.json
#   - version.mjs
#   - any file in scripts/ (recursively)
# and also automatically creates the noah_scripts_vX.Y.Z.zip file in downloads/.
#
# This script should be run before committing a version number bump.
#
# Usage:
#
#   ./update_version.sh <OLD_VERSION> <NEW_VERSION>
#
# This is most easily used with curly braces expansion, viz.
#
#   ./update_version.sh 2.0.{3,4}
#
# to update from 2.0.3 to 2.0.4.

usage() {
    cat << EOM
Usage:
  $0 <OLD_VERSION> <NEW_VERSION>

This is most easily used with curly braces expansion, viz.

  ./update_version.sh 2.0.{3,4}

to update from 2.0.3 to 2.0.4.
EOM
}

# Check arguments
if [ "$1" = "-h" ]; then
    usage
    exit 0
elif [ $# -lt 2 ]; then
    usage
    exit 1
fi

# cd to the correct directory
cd $(dirname "$0")

# Escape the dots in version numbers
old_vno=${1//./\\.}
new_vno=$2

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
"${sed_command[@]}" "s/${old_vno}/${new_vno}/g" "./version.mjs"

# Edit scripts
# We first get the date by grepping in noah_nus.py. Note that this regex will fail in the year 2100.
old_date=$(grep "^[[:digit:]]\{1,2\} [[:alpha:]]\{1,\} 20[[:digit:]]\{2\}" scripts/py/noah_nus.py)
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
zip -r "downloads/${long_name}.zip" "${long_name}" -x '*.DS_Store*'
rm -r ${long_name}

echo ""
echo "Version numbers updated from v${1} to v${2}."
