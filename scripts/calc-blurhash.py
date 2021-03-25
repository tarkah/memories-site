#! /bin/python

import os
import blurhash
import json

image_dir = './public/images'
files = []
hashes = []

with open('./public/private/hashes.json', 'r') as f:
    hashes = json.load(f)

for file in os.listdir(image_dir):
    if '/images/' + file in [file["image"] for file in hashes]:
        continue

    path = image_dir + '/' + file

    files.append({"file": file, "path": path})

files.sort(key=lambda f: f['file'])

for idx, file in enumerate(files):
    with open(file['path'], 'rb') as f:
        hash = blurhash.encode(f, 4, 3)

        print(f'{file["file"]} - {hash}')

        hashes.append({"image": '/images/' + file["file"], "hash": hash})


with open('./public/private/hashes.json', 'w') as f:
    json.dump(hashes, f)
