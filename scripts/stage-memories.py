#! /bin/python

import os
import blurhash
import json

image_dir = './public/images'

memories = []

for file in os.listdir(image_dir):
    path = '/images/' + file

    memories.append(
        {
            "title": "Placeholder",
            "image": path,
            "body": "Placeholder Message"
        },
    )

memories.sort(key=lambda f: f["image"])

with open('./public/private/memories-template.json', 'w') as f:
    json.dump(memories, f)
