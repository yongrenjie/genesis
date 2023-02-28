#!/usr/bin/env bash
#
# A script which checks out all git tags from v2.0.6 onwards (that's when the
# TypeScript migration was completed) and builds the website in the directory
# <toplevel>/X/Y/Z, where X.Y.Z is the version number. This script is meant to
# be run during CI, from the top-level directory of the repository.
#
# This allows users to access old versions of the website at
#     https://nmr-genesis.co.uk/X/Y/Z
# and is important for full reproducility.
#
# Note that this script is not designed to be robust. In particular, it assumes
# the following:
#  - That tags, sorted by chronological order with most recent last, has
#    v2.0.6 as the sixth entry. (Note that v2.0.1 is missing because at
#    that time, I had separate version numbers for scripts and the website.
#    The version numbers were only unified from v2.0.2 onwards.)
#  - That tags always consist of the form `vX.Y.Z`.
#  - That the top-level directory structure always consists of several files,
#    plus the folders 'scripts' and 'static', and that everything else is
#    built by the `tsc` command.
# 
# Jonathan Yong, 2021

# Check version of sed as GNU and BSD versions differ in sed -i behaviour
# Thanks https://stackoverflow.com/a/65497543/7115316
sed --version >/dev/null 2>&1
if [ $? -eq 0 ]; then
    sed_command=("sed" "-i")        # GNU
else
    sed_command=("sed" "-i" "")   # BSD
fi

git_branch=$(git rev-parse --abbrev-ref HEAD)

readarray -s5 -t tags < <(git for-each-ref --sort=creatordate --format '%(refname)' refs/tags | sed 's:refs/tags/v::')

echo "${#tags[@]}" tags found.

for i in "${!tags[@]}"; do
    tag=${tags[$i]}
    readarray -d. -t vnos < <(printf $tag)
    major=${vnos[0]}
    minor=${vnos[1]}
    patch=${vnos[2]}
    target_dir="${major}/${minor}/${patch}"
    git reset --hard v${tag}    # checkout doesn't work when there are changes
    tsc --outDir "${target_dir}/build"
    # We could use `cp * ${target_dir} || true`, but this is more explicit.
    find . -maxdepth 1 -type f | xargs -I {} cp {} "${target_dir}"
    cp -r static scripts "${target_dir}"
    if (( $i < ${#tags[@]} - 1 )); then
        "${sed_command[@]}" "s/<div\ id=\"warning\">/<div\ id=\"warning\">Please\ note\ that\ this\ is\ an\ old\ version\ of\ GENESIS\ (v${tag})/" "${target_dir}/index.html"
    fi
done

git reset --hard ${git_branch}
git checkout ${git_branch}
tsc
