#! /usr/bin/fish

mkdir -p output
for file in ./*.{png,jpg}
    set name (string split . $file)[2]
    echo converting $file to $name.jpg
    convert $file \
        -set option:distort:viewport \
        "%[fx:min(w,h)]x%[fx:min(w,h)]+%[fx:max((w-h)/2,0)]+%[fx:max((h-w)/2,0)]" \
        -filter point -distort SRT 0  +repage  \
        -strip -interlace Plane -gaussian-blur 0.05 -quality 90% \
        -resize 700x700\> \
        ./output/$name.jpg
end
