#!/bin/sh

# Set workdir to this dir (.scripts)
cd "$(dirname "$0")"

dir_with_build="../out/json/packages"

replace="\/out\/json/"

# Go to throw all package.json in directory '../out/json/packages'
for filename in `find $dir_with_build -type f \( -name "package.json" \)`
do
  file_content=`cat $filename`
  # Find package.json with "bin" property and get filename witch need for run package
  path_to_bin_js=`echo $file_content | grep -o '"bin": {[^}]*' | grep -o '": "[^"]*' | grep -o '[^"]*$'`
  if [ -n "$path_to_bin_js" ]; then
    out_json_package_dir="$(dirname "$filename")"
    filename_with_bin_js="$(basename "$path_to_bin_js")"
    # Define directory in project root with this bin file
    dir_root_project=`echo "$out_json_package_dir" | sed -e "s/$replace/g"`
    # Define bin file
    file_with_bin_js=`find $dir_root_project -type f \( -name "$filename_with_bin_js" \)`
    # Copy bin file in directory '../out/json/packages/[package_name]'
    cp $file_with_bin_js $out_json_package_dir
  fi
done