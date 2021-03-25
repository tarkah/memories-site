A simple website I created for my wife before our wedding, to reflect on memories we've shared over the years.

![](screenshots/demo.gif)

### Setup

```sh
# install npm deps
npm install

# install python deps
python3 -m  venv venv
source venv/bin/activate
pip install -r requirements.txt

# copy sample.env to .env and modify
# PASSWORD & ACCESS_TOKEN is used to secure the site and fetch all resources under
# public/private and public/images
cp sample.env .env

# copy photos to public/images folder
# then generate a memories-template.json file
python scripts/stage-memories.py

# this will create the file under public/private/memories-template.json
# copy these contents to the `memories.json` file in the same directory
# and fill out with title and body text

# calculate blurhashes for each photo, which will display when photos are loading.
# This will overwrite the public/private/hashes.json file
python scripts/calc-blurhash.py
```

### Run

- Prod `npm run start`
- Dev `npm run dev`